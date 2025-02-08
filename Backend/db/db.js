const mongoose = require("mongoose");

function connectToDb() {
  // mongoose
  //   .connect(process.env.DB_DEV_CONNECT)
  //   .then(() => {
  //     console.log("Connected to dev DB ");
  //   })
  //   .catch((err) => console.log(err));

  mongoose
    .connect(process.env.DB_PROD_CONNECT)
    .then(() => {
      console.log("Connected to prod DB");
    })
    .catch((err) => console.log(err));
}

module.exports = connectToDb;
