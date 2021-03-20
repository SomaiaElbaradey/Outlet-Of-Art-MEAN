const express = require('express');
const router = express.Router();
const { carts, validateCart, validateCartUpdate } = require('../schema/cart');
const products = require('../schema/product');
const auth = require('../middleware/auth');
const { orders, validateOrder } = require('../schema/order');
const multer  = require('multer');
const Gallery = require('../schema/image');

// get all products in cart for user
router.get('/', auth, async function (req, res) {
    try {
        //find the user cart
        const _user = req.user._id;
        const userCart = await carts.findOne({ _user }, { _product: 1 });
        if (!userCart) return res.send("orders don't exist.");
        //get his productsIds array
        const productsIds = userCart._product;
        //get user products 
        const userProducts = await products.find({ "_id": { "$in": productsIds } });
        if (!userProducts) return res.status(400).send("products don't exist.");
        res.status(200).send(userProducts);
    } catch (err) {
        res.send({ error: err })
    }
});

//user to delete product from cart 
router.delete('/:id', auth, async function (req, res) {
    try {
        const _user = req.user._id;
        const _product = req.params.id;
        //find the cart of this user 
        const cart = await carts.findOne({ _user });
        if (!cart) return res.status(404).send("failed to find the cart.");
        //make sure it's the owner who is deleting 
        if (_user != cart._user) return res.status(405).send('method not allowed.');
        //update and delete the product id from the cart 
        await carts.updateOne({ _id: cart._id }, { $pull: { '_product': _product } });
        return res.status(200).send("product was deleted successfully");
    }
    catch (err) {
        res.send({ error: err })
    }
})

//add product to cart
router.post('/', auth, async function (req, res) {
    try {
        //define the cart body 
        const _user = req.user._id;
        const value = {
            _product: req.body._product,
            _user
        }
        //validation
        const { error } = validateCartUpdate(value);
        if (error) return res.status(400).send(error.details[0].message);
        //find the cart of this user 
        let cart = await carts.findOne({ _user });
        //create cart if user doesn't have any
        if (!cart) {
            //add cart
            cart = new carts(value);
            await cart.save();
        }
        //update the cart and add the product to it
        await carts.updateOne(
            { _id: cart._id },
            { $addToSet: { _product: req.body._product } }
        )
        res.send("product added to cart successfully.")
    }
    catch (err) {
        res.send({ error: err })
    }
})

//checkout cart to order
router.post('/checkout', auth, async function (req, res) {
    try {
        //define the order products and price
        const _user = req.user._id;
        const value = {
            _product: req.body._product,
            totalPrice: req.body.totalPrice,
            _user
        }
        //validation
        const { error } = validateOrder(value);
        if (error) return res.status(400).send(error.details[0].message);

        //create order for the user 
        const order = new orders(value);
        await order.save();

        //update and delete the products from the cart 
        //find the cart of this user 
        const cart = await carts.findOne({ _user });
        if (!cart) return res.status(404).send("failed to find the cart.");
        const cartValue = {
            _product: [],
            _user
        }
        if (_user != cart._user) return res.status(405).send('method not allowed.');
        //update the cart 
        await carts.findByIdAndUpdate(cart._id, cartValue);
        res.send("order created successfully.")
    }
    catch (err) {
        res.send({ error: err })
    }
})





//try image
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
      console.log(file);
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});

var upload = multer({storage: storage});

router.post('/image', upload.single('file'), async function (req, res) {

    if(!req.file) {
        return res.status(500).send({ message: 'Upload fail'});
    } else {
        req.body.imageUrl = 'http://localhost:3000/images/' + req.file.filename;
        Gallery.create(req.body, function (err, gallery) {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.json(gallery);
        });
    }
})

router.get('/image', auth, async function (req, res) {

        //find the user cart
        const _id = "60554ea84dc49f2da87f6529";
        const image = await Gallery.findById({ _id });
        if (!image) return res.send("image don't exist.");
        res.status(200).send(image);
   
});


module.exports = router;