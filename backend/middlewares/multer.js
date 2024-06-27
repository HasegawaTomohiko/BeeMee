const multer = require('multer');
const path = require('path');
const { v4 : uuidv4 } = require('uuid');

const storage = multer.diskStorage({
	destination: function (req,file, cb) {
		cb(null, '/app/media');
	},
	filename: function (req,file,cb){
		cb(null,`${uuidv4()}.${file.mimetype.split('/')[1]}`);
	}
});

const upload = multer({
    storage : storage,
    fileFilter: (req,file,cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimeType = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

        if(mimeType && extName) return cb(null, true);

        cb(new Error('Error: File upload only supports the following filetype - ' + fileTypes));
    }
});

module.exports = upload;