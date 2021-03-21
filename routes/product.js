const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Product = require('../schema/product');
const auth = require('../middleware/auth')
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    console.log(file);
    let filetype = '';
    if (file.mimetype === 'image/gif') {
      filetype = 'gif';
    }
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    cb(null, 'image-' + Date.now() + '.' + filetype);
  }
});
const upload = multer({ storage: storage });

///add new product 
router.post('/add', auth, upload.single('image'),
  body('title').isLength({ min: 1 })
    .withMessage('title is required')
  , body('price').isLength({ min: 1 })
    .withMessage('price is required'),
  body('details').isLength({ min: 1 })
    .withMessage('details is required')
  , async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send({ error: errors.errors[0].msg });

    try {
      if (!req.file) return res.status(500).send({ message: 'Upload fail' });
      req.body.image = `${process.env.API}/images/${req.file.filename}`;

      const product = new Product(req.body)
      console.log(product)
      await product.save()
    }
    catch (e) {
      console.log("err:", e);
      return next(e);
    }
  })

// get product by id
router.get('/:id', auth, async (req, res) => {
  const product = await Product.find({ _id: req.params.id })
  if (product) return res.send(product)
})

// get all products
router.get('/', auth, async (req, res) => {
  const products = await Product.find()
  if (products) return res.send({ products })
})

///////////////////////// edit product by id //////////////////////////////////

router.patch('/:id', auth, async (req, res) => {
  let product
  try {
    product = await Product.findById(req.params.id)
  }
  catch (ex) {
    return res.send({ error: 'this product id is not exist' })
  }

  // await cloudinary.uploader.destroy(product.cloudinary_id);
  //  const image = await cloudinary(req.file.path);
  let _image = req.file.filename
  Img = `${process.env.API}/${_image}`
  const updated = await Product.updateOne(product, {
    $set: {
      title: req.body.title,
      price: req.body.price,
      details: req.body.details,
      image: Img,
      // cloudinary_id:image.public_id||product.cloudinary_id  
    }
  }, { new: true });
  if (updated)
    return res.send({ message: 'Product is edited successfully', product: product })

})

///Delete product by id 
router.delete('/:id', auth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.send({ error: 'this product id is not exist' })
  //await cloudinary.uploader.destroy(product.cloudinary_id);
  await Product.deleteOne(product)
  return res.send({ message: 'product deleted successfuly' })
})

module.exports = router;
