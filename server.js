const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("unCaught Exception occured Shutting down!");
  process.exit(1);
});

const app = require("./app");

mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    // console.log(conn);
    console.log("DB connected successfully!");
  })
  .catch((err) => {
    console.log("DB not connected, ERROR Occured");
  });

const port = process.env.PORT || 5000;
// console.log(process.env);
// console.log(x);

const server = app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("unhandled rejection occured Shutting down!");

  server.close(() => {});
});
