const multer = require('multer');

let storage = multer.diskStorage({
    destination : function(req, file, cb) {
       cb(null, 'uploads');
    },

    filename : function(req, file, cb) {
      cb(null, `${Date.now()}.jpg`)
    }

})

let upload = multer({storage})

module.exports = upload;