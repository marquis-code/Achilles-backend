const mongoose = require('mongoose');
let d = new Date();
let date = d.getUTCDate();
let month = d.getUTCMonth() + 1;
let year = d.getUTCFullYear();
let dateString = date + '/' + month + '/'  + year;

let TestimoniesSchema = new mongoose.Schema ({
    fileName : {
       type : String,
       required:[true, 'Testimony image is required']
    },
    username:{ 
        type: String, 
        lowercase: true,
        required:[true, 'Username is required'],
        minlength: [3, 'Username can\'t be smaller than 3 characters'],
        maxlength: [64, 'Username can\'t be greater than 64 characters' ],
    },
    level : {
        type : Number,
        required:[true, 'Academic Level is required'],
      },
       comment:{ 
        type: String, 
        lowercase: true,
        required:[true, 'Comment is required']
    },  
    date:{
        type: String,
        default: dateString
       }
},{
    timestamps: true
});

const Testimonies = mongoose.model('Testimonies',TestimoniesSchema);

module.exports = Testimonies;