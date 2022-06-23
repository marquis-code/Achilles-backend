const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

let SpotSchema = new mongoose.Schema ({
    imageUrl : {
       type : String,
       required:[true, 'Spot image is required']
    },
    category :{
        type : ObjectId,
        ref : 'Category',
        required:[true, 'Question Category is required'],
    },
    
    question: {
        type : String,
        required:[true, 'Question is required'],
    },
    
    optionA: { 
        type: String,
        required:[true, 'OptionA is required'],
    },
    
    optionB: {
         type: String,
         required:[true, 'OptionB is required'],
    },
    
    optionC: {
         type: String,
         required:[true, 'OptionC is required'],
    },
    
    optionD: {
        type: String,
        required:[true, 'OptionD is required'],
    },
       
    answer : {
       type : String,
       required:[true, 'Answer is required'],
    },
    date:{
        type: Date,
        default: new Date()
       }

},{
    timestamps: true
});

const SpotQuiz = mongoose.model('Spots',SpotSchema);

module.exports = SpotQuiz;
