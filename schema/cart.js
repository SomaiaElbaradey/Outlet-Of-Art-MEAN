const mongoose = require('mongoose');
const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

const schema = new mongoose.Schema({
    _user:{
        type: mongoose.ObjectId,
        ref: "users",
        required: true
    },
    _product: {
        type: [mongoose.ObjectId],
        ref: "products",
    },
    totalPrice: {
        type: Number,
    },
    image:{
        type:String
    }
})
module.exports.carts = mongoose.model('Cart', schema)

//validation 
module.exports.validateCart = function validateCart(Cart) {
    const schema = Joi.object({
        _user: Joi.objectId().required(),
        _product: Joi.array().items(Joi.objectId()),
        totalPrice: Joi.number()
    })
    return schema.validate(Cart);
};

//validate add product to cart
module.exports.validateCartUpdate = function validateCartUpdate(Cart) {
    const schema = Joi.object({
        _user: Joi.objectId().required(),
        _product: Joi.objectId(),
        totalPrice: Joi.number()
    })
    return schema.validate(Cart);
};