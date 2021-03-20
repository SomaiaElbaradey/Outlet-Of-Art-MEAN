const cloudinary = require("cloudinary");
const _ = require('underscore');

const Q = require("q");

function upload(file) {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_KEY,
        api_secret: process.env.CLOUD_SECRET

    });

    return new Q.Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(file, {width: 50, height: 50}, (err, res) => {
            if (err) {
                console.log('cloudinary err:', err);
                reject(err);
            } else {
                console.log('cloudinary res:', res);
                return resolve(res);
            }
        });
    });
};


module.exports.upload = upload;