const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

//////////// schema for user table in DB ////////////////////
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, validate: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ },
    username: { type: String, required: true },
    password: { type: String, required: true },
    image:  {type:String},
    cloudinary_id:{type:String},
    gender: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false }
})
userSchema.methods.generateAuthToken = (id, isAdmin) => {
    const token = jwt.sign(
        {
            _id: id,
            isAdmin: isAdmin
        },
        process.env.SECRET_KEY)
    return token
}

///////match user schema with user table ///////
const User = mongoose.model('users', userSchema)

module.exports = User;
