const mongoose = require('mongoose');
const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

const schema = new mongoose.Schema({
    _user: {
        type: mongoose.ObjectId,
        ref: "users",
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    _product: {
        type: [mongoose.ObjectId],
        ref: "products",
    },
    username: {
        type: String,
    },
    date:{
        type: Date,
    },
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'pending'],
        default: 'pending'
    },
    productNames: {
        type: Array
    }
})
module.exports.orders = mongoose.model('Order', schema)

//validation 
module.exports.validateOrder = function validateOrder(order) {
    const schema = Joi.object({
        _user: Joi.objectId().required(),
        totalPrice: Joi.number().required(),
        _product: Joi.array().items(Joi.objectId()),
        username: Joi.string().required(),
        date: Joi.date(),
        productNames: Joi.array(),
        status: Joi.array().valid('accepted', 'rejected', 'pending'),
    })
    return schema.validate(order);
};

//validate updating status
module.exports.validateOrderStatus = function validateOrder(order) {
    const schema = Joi.object({
        status: Joi.array().valid('accepted', 'rejected', 'pending'),
    })
    return schema.validate(order);
};