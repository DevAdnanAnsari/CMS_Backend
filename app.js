const express = require("express");
const app = express();
const morgan = require('morgan');
const cors = require("cors");
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const { setupRouters } = require("./routers/index");
const port = 5010;

// db connection
app.use(morgan('dev'));

const url = 'mongodb+srv://adnan9:Pune123@cluster0.lfm5r5d.mongodb.net/Coaching_management';

mongoose.connect(url, {})
  .then(() => console.log("Database connected")).catch((err) => {
    console.log("errr", err)
  });



//  cross origin error
app.use(cors());




app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//setup rourer

setupRouters(app);

//error if any one will hit url not found
app.use((req, res) => {
  res.status(404).json({
    Error: 'url not found'
  })
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
