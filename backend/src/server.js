require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const contentRoutes = require("./routes/contentRoutes");
const poetRoutes = require("./routes/poetRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");
const userRoutes = require("./routes/userRoutes");
const settingsRoutes = require("./routes/settingsRoutes");


const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/poets", poetRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/settings", settingsRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found.`,
    });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║   🌟 Asifemaan Backend Server                 ║
  ║                                               ║
  ║   Port:        ${PORT}                           ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
  `);
});

module.exports = app;
