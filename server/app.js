let express = require('express');
let cors = require('cors');
let mongoose = require('mongoose');
let path = require('path')



let app = express();

let multer = require('multer')

require('dotenv').config();


let userRouter = require('./routes/user.js')

;

app.use(cors());
app.use(express.json());
app.use('/user',userRouter);



let port = process.env.PORT || 5001

console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL)
  .then(()=>{
    console.log('mongodb Connected successfully');
    app.listen(port,()=>{
      console.log(`listening to : http://localhost:${port}`)
    })
  }).catch((err) => {
  console.log('error connecting to mongodb:' + err);
});



