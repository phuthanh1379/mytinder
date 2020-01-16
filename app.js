const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

// Connect to MongoDB through mongoose
// mongoose.connect(
//     'mongodb://dbUser0:' + 
//     // process.env.MONGO_ATLAS_PW + 
//     'Aa12345' + 
//     // '@node-restful-jwt-4afi6.mongodb.net/test?retryWrites=true&w=majority', 
//     '@node-restful-jwt-4afi6.mongodb.net/test?ssl=true&replicaSet=node-restful-jwt-4afi6&authSource=admin', 
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     }
// );

mongoose.connect(
        'mongodb://dbUser0:' + 
        process.env.MONGO_ATLAS_PW + 
        // 'Aa12345' + 
        '@node-restful-jwt-shard-00-00-4afi6.mongodb.net:27017,node-restful-jwt-shard-00-01-4afi6.mongodb.net:27017,node-restful-jwt-shard-00-02-4afi6.mongodb.net:27017/test?ssl=true&replicaSet=node-restful-JWT-shard-0&authSource=admin&retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
)
.catch(error => console.log(error));
mongoose.Promise = global.Promise;

app.use(morgan('dev'));

// use body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// use express
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow access for any pages
    res.header(
        'Access-Contorl-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods', 
            'PUT', 
            'POST', 
            'PATCH', 
            'DELETE', 
            'GET'
        );
        return res.status(200).json({});
    }
    next();
});

// Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

// 404 NOT FOUND
app.use((req, res, next) => {
    const error = new Error('Not found.');
    error.status = 404;
    next(error);
});

// ERROR HANDLER
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    }); 
});

module.exports = app;