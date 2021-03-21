require('express-async-errors');
const express = require('express');
const app = express();
require('./dbConnection');
const port = 3000;
const user = require('./routes/user');
const product = require('./routes/product');
const order = require('./routes/order');
const auth = require('./routes/auth');
const cart = require('./routes/cart');
const cors = require('cors')

require('dotenv').config();

/////// check if env variables is set or no /////
if (!process.env.SECRET_KEY) {
  console.error('FATAL ERROR: Secret_key is not defined!!')
  process.exit(1)
};

// a middleware that logs the request url, method, and current time 
app.use((req, res, next) => {
  var time = new Date();
  console.log('Time:', time.getHours(), ':', time.getMinutes(), ':', time.getSeconds())
  console.log('Method:', req.method)
  console.log('URL:', req.url)
  next()
});

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
// app.use(express.static(__dirname + '/dist/Eco'));

app.use('/api/users', user);
app.use('/api/product', product);
app.use('/api/order', order);
app.use('/api/cart', cart);
app.use('/api/users', auth);
app.use('/api/admin', auth);

// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname + '/dist/Eco/index.html'));
// });

//a global error handler that logs the error 
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send({ error: 'internal server error' })
  next(err);
});

app.listen(process.env.PORT || port, () => {
  console.info(`server listening on port 3000`);
});
