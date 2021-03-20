const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

/////////////check if connected to db or no ///////////////
mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost/EcommerceDB', 
{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to MongodDB ...'))
    .catch((err) => console.error('can not connect to MongoDB', err))