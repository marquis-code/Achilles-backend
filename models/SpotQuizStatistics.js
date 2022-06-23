const mongoose = require('mongoose');
let d = new Date();
let date = d.getUTCDate();
let month = d.getUTCMonth() + 1;
let year = d.getUTCFullYear();
let dateString = date + '/' + month + '/'  + year;

let StatSchema = new mongoose.Schema ({
    score:{ 
        type: Number,

    },
    numberOfQuestions:{
        type : Number,
      
    },
    numberOfAnsweredQuestions:{
        type: Number,
     
    },
    correctAnswers:{
     type: Number,

    },
   wrongAnswers:{
    type: Number,
   },
   fiftyFiftyUsed:{
    type: Number,

   },
   hintsUsed:{
    type: Number,
   },
   date:{
    type: String,
    default: dateString
   },
   matric:{
       type: Number
   },
   minutes:{
    type: Number
   },
    seconds:{
        type: Number
    },
   answeredQuestions : {
    type : [
        {   snapShotImage : String,
            snapshotQuestion : String,
            snapshotAnswer : String,
            snapshotClickedOption : String
        }
    ]
   }
});

const Spot_Quiz_Statistics = mongoose.model('Spot_Quiz_Statistics',StatSchema);

module.exports = Spot_Quiz_Statistics;

