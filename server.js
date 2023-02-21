const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const carRoutes = require("./routes/carRoutes");
const userRoutes = require("./routes/userRoutes");
const hotcarRoutes = require("./routes/hotcarRoutes");
const queryRoutes = require("./routes/queryRoutes");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://192.168.1.137:3000",
      "https://drive-go-frontend.vercel.app/",
    ],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes Middleware
app.use("/api/cars", carRoutes);
app.use("/api/user", userRoutes);
app.use("/api/hotcar", hotcarRoutes);
app.use("/api/query", queryRoutes);

app.get("/", (req, res) => {
  res.send("Home Page");
});
// Connect to db and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
