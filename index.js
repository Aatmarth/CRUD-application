const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/week6App")
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const express = require("express");
const app = express();
const nocache = require('nocache')

//User Routes
app.use(nocache());
const userRoute = require('./routes/userRoute'); 
app.use('/',userRoute);

const adminRoute = require('./routes/adminRoute'); 
app.use('/admin',adminRoute);

app.listen(3000, () => {
    // console.log(`Server is running on http://localhost:3000/admin`);
    console.log(`Server is running on http://localhost:3000/`);
  });  
