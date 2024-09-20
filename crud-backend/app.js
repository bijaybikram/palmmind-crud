const express = require("express");
const app = express();
const { connectDatabase } = require("./database/database");

// importing routes here
const authRoute = require("./routes/authRoute");

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connection to database
connectDatabase(process.env.MONGO_URI);

// all the APIs are called here
app.use("/api/", authRoute);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
