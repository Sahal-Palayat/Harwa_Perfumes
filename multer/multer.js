const multer = require('multer')
const path = require('path')
const bcrypt = require('bcrypt')
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/products/');
    },
    filename: function (req, file, callback) {
        let filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        if (!req.session.images) {
            req.session.images = []
        }
        req.session.images.push(filename)
        console.log( req.session.images);
        // req.session.images = [... req.session.images].reverse();
        console.log( req.session.images);
        callback(null, filename)
    }
});



const upload = multer({ storage: storage })

module.exports = { upload }