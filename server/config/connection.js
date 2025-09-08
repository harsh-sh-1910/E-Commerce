const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://harshsh1910:harshsh1910@cluster0.cd2ba.mongodb.net/XSTORE?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("CONNECTED TO DATABASE SUCCESSFUL");
  })
  .catch((err) => {
    console.log(err);
  });
