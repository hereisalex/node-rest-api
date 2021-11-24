const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//dotenv file keeps our sensitive information hidden
dotenv.config();
//connect to our mongodb database
mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to MongoDB");
    }
);


//middleware
//parse incoming requests
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
//routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

//this is our express middleware
app.listen(8800, () => {
    console.log("Backend server is running on port 8800!");
});

