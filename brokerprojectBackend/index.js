const express=require('express');
const mongoose= require('mongoose');
const dotenv= require('dotenv');
const userRouter= require('./routes/user.routes.js');
const authRouter = require('./routes/auth.route.js');
const listingRouter=require('./routes/listing.route.js');
const cookieParser = require('cookie-parser');
const path=require('path');

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to mongoDB");
}).catch((err)=>{
console.log("DB connection error: ",err);
});

 const __dirtname= path.resolve();

const app= express();

app.use(express.json());

app.use(cookieParser());


app.listen(1000, () => {
    console.log("Server is up and running at port 1000.");
});


//routes

app.use('/broker/user',userRouter);
app.use('/broker/auth',authRouter);
app.use('/broker/listing',listingRouter);


app.use(express.static(path.join(__dirtname,'/brokerprojectclient/dist')));

app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirtname,'brokerprojectclient','dist','index.html'));
})


app.use((err,req,res,next) =>{
const statusCode=err.statusCode || 500;
const message= err.message || 'Internal Server Error';

return res.status(statusCode).json({
success:false,
statusCode,
message,
})
});