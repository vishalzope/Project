if(process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const dbUrl = process.env.ATLASDB_URL;



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


// ✅ Session Store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600, // 24 hours
  crypto: {
    secret: process.env.SECRET
  },
});

store.on("error", (err) => {
  console.log("Session Store Error",err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:  7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// // ✅ Root Route
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demoUser",async (req, res) => { 
//   let fakeuser = new User({
//     email: "Student@gmail.com",
//     username: "delta-Student",
//   })
//   let registerUser = await User.register(fakeuser, "helloworld");
//   res.send(registerUser);
// });

// Import Routes
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/User.js");

main()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

async function main() {
  await mongoose.connect(dbUrl);
}

// ✅ Set View Engine & Templates
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ✅ Routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// ✅ 404 Catch-All 
app.all("*random", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// ✅ Error Handler Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// ✅ Start Server
app.listen(8080, () => {
  console.log("🚀 Server is listening on port 8080");
});
