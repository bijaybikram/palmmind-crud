const express = require("express");
const app = express();
const cors = require("cors");
const { connectDatabase } = require("./database/database");

// importing routes here
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

require("dotenv").config();

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connection to database
connectDatabase(process.env.MONGO_URI);

// all the APIs are called here
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
