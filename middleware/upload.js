const multer = require('multer');

const imageStorage = multer.diskStorage({
    
    destination: (req, file, cb)=> cb(null, './public'),
    filename: (req, file, cb) => cb(null,file.originalname )
})
const fileFilter = (req, file, cb) =>{
    const filters = (
        file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/jpg'  || 
        file.mimetype === 'image/png'
    );
    if (filters) {
        cb(null, true)
    } else {
        cb(null, false)
    }
    
}

const uploadImage = multer({storage: imageStorage, fileFilter: fileFilter}).single('image');

module.exports = uploadImage