const express = require('express')
let router = express.Router();
const Comment = require('../models/Comment');
// const SpotQuiz = require('../models/SpotQuiz');
const upload = require('../middleware/multer');
const PastQuestions = require('../models/PastQuestions');
const QuestionCategory = require('../models/QuestionCategory');
const Spot_Quiz_Statistics = require("../models/SpotQuizStatistics");
const {authenticateJwt} = require('../middleware/authenticator');

router.post('/createSpot', authenticateJwt, /* upload.single('spotImage'), */ async (req, res)=>{
  const { question,optionA, optionB, optionC, optionD, answer, category, imageUrl } = req.body;
  try {
    const data = { question,optionA, optionB, optionC, optionD, answer, category, imageUrl }
    const newQuestion = await SpotQuiz.create(data);
    newQuestion.save()
    res.status(201).json({successMessage : "New Spot Question was sucessfully saved to database"});
 
  } catch (error) {
    res.status(500).json({errorMessage : "Sorry!!! Internal server Error"});
  }
  
});

// Get All Spots Questions
router.get('/spotQuestions', authenticateJwt, async (req, res)=>{
  try {
   const allQuestions = await SpotQuiz.find().limit(30).populate('category', 'category');; //The limit helps to fetch limites amount of data fro MongoDb
   return res.status(200).json(allQuestions);
  } catch (error) {
   res.status(500).json({errorMessage : 'Something went wrong, Please try again.'});
  }
});


router.post('/pastQuestions', authenticateJwt, async (req, res)=>{
const { question, answer, category } = req.body;

try {
  const pastData = { question, answer, category }

const newPastQuestion = await PastQuestions.create(pastData);

newPastQuestion.save()

return res.status(201).json("Past Question was sucessfully saved to database");

} catch (error) {
  res.status(500).json({errorMessage : 'Something went wrong, Please try again.'});
}
})


router.get('/getPastQuestions',authenticateJwt, async (req, res)=>{
 try {
  const allPastQuestions = await PastQuestions.find();
  return res.status(200).json(allPastQuestions);
 }catch(error) {
  res.status(500).json({errorMessage : 'Something went wrong, Please try again.'});
 }
});
  

/* All spors stat */
router.get('/allSpotStat', authenticateJwt, async (req, res)=>{
  try {
   const allQuestions = await Spot_Quiz_Statistics.find({}).sort({date : -1}); //The limit helps to fetch limites amount of data fro MongoDb
   return res.status(200).json(allQuestions);
  } catch (error) {
   res.status(500).json({errorMessage : 'Something went wrong, Please try again.'});
  }
});


//Delete a Question

 router.post("/spotQuizStat", authenticateJwt, (req, res) => {
    const { score,minutes, seconds, numberOfQuestions, numberOfAnsweredQuestions, correctAnswers, wrongAnswers, fiftyFiftyUsed, hintsUsed, matric, answeredQuestions } = req.body;
                                                                                                                                          
        const new_Statistics = new Spot_Quiz_Statistics({
          score,
          numberOfQuestions,
          numberOfAnsweredQuestions,
          correctAnswers,
          wrongAnswers,
          fiftyFiftyUsed,
          hintsUsed,
          matric,
          answeredQuestions,
          minutes,
          seconds
        });
        new_Statistics
          .save()
          .then(() => {
            console.log(new_Statistics);
            res.status(200).json({successMessage : "Quiz statistics has been saved!!"});
          })
          .catch(() => {
            return res.status(500).json({errorMessage : "OOPS!!!, Something went wrong while saving Quiz statistics. Please try again"});
          });

  
  }
  );

  router.post("/quizStat", authenticateJwt, (req, res) => {
    const {minutes, seconds, score, numberOfQuestions, numberOfAnsweredQuestions, correctAnswers, wrongAnswers, fiftyFiftyUsed, hintsUsed, matric, answeredQuestions } = req.body;
                                                                                                                                          
        const new_Statistics = new Quiz_Statistics({
          score,   
          numberOfQuestions,
          numberOfAnsweredQuestions,
          correctAnswers,
          wrongAnswers,
          fiftyFiftyUsed,
          hintsUsed,
          matric,
          answeredQuestions,
          minutes,
          seconds
        });
        new_Statistics
          .save()
          .then(() => {
            console.log(new_Statistics);
            res.status(200).json({successMessage : "Quiz statistics has been saved!!"});
          }).catch((error) => {
               console.log(error);
          })
          .catch(() => {
            return res.status(500).json({errorMessage : "OOPS!!!, Something went wrong while saving Quiz statistics. Please try again"});
          });

  
  }
  );

  router.get('/singleSpotStat/:email', authenticateJwt, async (req, res) => {
    const userEmail = req.params.email;
    try {
      if(!userEmail){
        return res.status(404).json({errorMessage : `User does not exist`});
      }

      const stat = await Spot_Quiz_Statistics.find({email : {$eq : userEmail}}).sort({date : -1})
      console.log(stat);
      res.status(200).json(stat);
    } catch (error) {
      return res.status(500).json({errorMessage : "OOPS!!!, Something went wrong7"});
    }
  });


  router.post('/category', authenticateJwt, async (req, res) => {
    const {category} = req.body;
    try {
     let existingCategory = await QuestionCategory.findOne({category});
     if(existingCategory) {
      return res.status(400).json({errorMessage : `${category} Category already exist`});
     };

      let newCategory = new QuestionCategory();
      newCategory.category = category
      await newCategory.save();
      return res.status(200).json({successMessage : `${category} Category was successfully created`});

    } catch (error) {
      return res.status(500).json({errorMessage : 'Something went wrong, Please try again.'});
    }
  })

  router.get('/allCategories', authenticateJwt, async (req, res)=>{
    try {
     const allCategories = await QuestionCategory.find().limit(30); //The limit helps to fetch limites amount of data fro MongoDb
     return res.status(200).json(allCategories);
    } catch (error) {
     res.status(500).json({errorMessage : 'Something went wrong, Please try again.'});
    }
  });


router.delete('/deleteSpot/:id', authenticateJwt, async (req, res) => {
  const _id = req.params.id;
try {
  const deletedSpot = await SpotQuiz.deleteOne({_id}).exec();
    
  if(deletedSpot.deletedCount === 0){
     return res.status(404).json({errorMessage : `Spot question With ID ${_id} does not Exist`});
  }else{
     res.status(200).json({successMessage : `Spot question With ID ${_id} Was Successfully Deleted`});
  }
} catch (error) {
  res.status(500).json({errorMessage: 'Something went wrong while fetching user'});
}
})

router.get('/getSpotQuestion/:id', authenticateJwt, async(req, res) => {  
  const _id = req.params.id;                                                            
   try {
    const question = await SpotQuiz.findOne({_id});
    if(!question){
      return res.status(404).json({errorMessage : `Spot question With ID ${_id} Does Not Exist`});
    }else{
      return res.status(200).json(question);
    } 
   } catch (error) {
    res.status(500).json({errorMessage : 'Something went wrong, Please try again.'});
   }
  });

  router.put('/updateSpotQuestion/:id', authenticateJwt, async (req, res) => {
    const { question,optionA, optionB, optionC, optionD, answer, category  } = req.body;
    const _id = req.params.id;

    try {
      let questions = await SpotQuiz.findOne({_id});

    if(!questions){
       return res.status(200).json(`Question with ID ${_id} was not found; a new question was created`);
    }else{
        questions.category = category;
        questions.question = question;
        questions.optionA = optionA;
        questions.optionB = optionB;
        questions.optionC = optionC;
        questions.optionD = optionD;
        questions.answer = answer;
        await questions.save();
        return res.status(200).json({successMessage : `Question data was successfully updated`});
    }
    } catch (error) {
      return res.status(500).json({errorMessage: 'Something went wrong'});
    }
});



//Comments API
router.post('/comments', authenticateJwt,  async (req, res)=>{
  const { comment, username, matric, level } = req.body;
  
  try {
    const data = {username, matric, level, comment }
    const newComment = await Comment.create(data);
    newComment.save()
    res.status(201).json({successMessage : "Comment was successfully recieved we'll review it and revert back to you."});
 
  } catch (error) {
    res.status(500).json({errorMessage : "Sorry!!! Internal server Error"});
  }
});
  
router.get('/allComments', authenticateJwt, async (req, res)=>{
  try {
   const allComments = await Comment.find({}).sort({date : -1});
   return res.status(200).json(allComments);
  } catch (error) {
   res.status(500).json({errorMessage : 'Something went wrong, Please try again.'});
  }
});
module.exports = router;