const express = require("express");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const sellerRoutes = require("./routes/seller");
const buyerRoutes = require("./routes/buyer");

const app = express();
const port = 3000;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Layout
app.use(expressLayouts);
app.set("layout", "layouts/public");

// Body parser
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(
	session({
		secret: "taskgo-secret-key",
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			maxAge: 1000 * 60 * 60 * 2, // 2 jam
		},
	}),
);

app.use((req, res, next) => {
	console.log();
	res.locals.currentUser = req.session.user || null;
	res.locals.currentPath = req.path;
	res.locals.error = null;
	next();
});

// Routes
app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/admin", adminRoutes);
app.use("/seller", sellerRoutes);
app.use("/buyer", buyerRoutes);

// 404
app.use((req, res) => {
	res.status(404).send("Page not found");
});

app.listen(port, () => {
	console.log(`App running on http://localhost:${port}`);
});
