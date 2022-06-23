const mongoose = require('mongoose');
const PastQuestionsSchema = new mongoose.Schema({
category :{
    type : String,
    required:[true, 'Question Category is required'],
},

question: {
    type : String,
    required:[true, 'Question is required'],
},
   
answer : {
   type : String,
   required:[true, 'Answer is required'],
},
  date:{
    type: Date,
    default: new Date()
   },

});

const PastQuestions = mongoose.model('Past_Questions', PastQuestionsSchema);
module.exports = PastQuestions;

