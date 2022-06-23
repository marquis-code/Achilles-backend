const express = require('express')
let router = express.Router(); 
const User = require('../models/User');
const { registerSchema } = require("../models/validations/authValidation");
// const { loginSchema } = require("../models/validations/loginValidation");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const {authenticateJwt} = require('../middleware/authenticator');
// const moment = require('moment');
// const crypto = require('crypto');
// const upload = require('../middleware/multer');
const _ = require('lodash');


// let JWT_SECRET = process.env.JWT_SECRET
// let JWT_EXPIRE= process.env.JWT_EXPIRE
// let CLIENT_URL= process.env.CLIENT_URL

router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, department, school } = req.body;
  console.log(req.body);

  const validationResult = registerSchema.validate(req.body, { abortEarly: false });
  console.log(req.body);
  if (validationResult.error) {
    console.log(validationResult.error.details[0].message);
    let errorMsg = validationResult.error.details[0].message
    return res.status(400).json({ errorMessage: errorMsg });
  }

    try {
        const user = await User.findOne({email});
        if (user) {
        return res.status(400).json({ errorMessage: "User Already Exist" });
        }

        const salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ firstName, lastName, email, department, school, password:hashedPassword });
        console.log(newUser)
        
        await newUser.save();

        return res.status(201).json({ successMessage: "Registeration success, Please sign in", username});

   } catch (error) {
    return res.status(500).json({ errorMessage: "Something went wrong, please try again." });
   }
})


router.post('/signin', async (req, res) => {
  const {email, password} = req.body;

  const validationResult = loginSchema.validate(req.body, { abortEarly: false});
    if (validationResult.error) {
      return res.status(400).json({
        errorMessage:  "Oops Login Failed!! Please Enter All Fields information Correctly."  
      });
    }

  try {
      const user = await User.findOne({email}).select("+password");
      if(!user) {
         return res.status(404).json({ errorMessage: "User Not Found"});
      } 
  
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if(!isMatchPassword) {
         return res.status(400).json({ errorMessage: "Invalid Login Credentials"});
       } 
      
       const jwtPayload = {_id : user._id}

  
       const accessToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
       const refreshToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
       
       const cookieOptions = {
        httpOnly : true,
        maxAge : 24 * 60 * 60 * 60 * 1000
       }
       
       req.cookies('jwt', refreshToken, cookieOptions);
       res.status(200).json({accessToken})
  
        // jwt.sign(jwtPayload, JWT_SECRET, {expiresIn : JWT_EXPIRE}, (err, token) => {
        //   if(err) {
        //   return res.status(400).json({ errorMessage: "Jwt Error"});
        //   }
        
        //   const {_id, firstName, lastName, email, school, department } = user;
  
        //   console.log(user);
  
        // return res.status(200).json({
        //   token,
        //   user: { _id, firstName, lastName, email, school, department },
        // });
        // })
  
  } catch (error) {
  return res.status(500).json({ errorMessage: "Something went wrong, please try again." });
  }
});


// router.post('/forgot', (req, res) => {
//   const {email} = req.body;
//    crypto.randomBytes(32, (error, buffer) => {
//       if(error) {
//         return res.status(500).json({errorMessage : 'Internal server error'})
//       }

//       const token = buffer.toString('hex');
//       User.findOne({email})
//       .then((user) => {
//           if(!user){
//             return res.status(404).json({errorMessage : 'User does not exist'})
//         }
//       user.resetPasswordToken = token;
//       user.expireToken = Date.now() + 3600000;
//       user.save().then(() => {

//       transporter.sendMail({
//         to : email,
//         from: 'Achilles Drill <no-reply@achillesdrill.com>',
//         subject: `Password reset`,
//         html: `
//         <div style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);  border-radius: 25px; padding: 10px">
//           <p>Hello, ${user.username}</p>
//           <p>We've recieved a request to reset the password for your Achilles Drill account associated with ${email}. yeah. No changes have been made to your account yet.</p>
//           <p>You can reset your password by clicking the link below:</p
//           <a clicktracking=off href=${CLIENT_URL}/reset/${token}>Reset my password</a>
//           <hr />
//           <p>Please note that this link will expire within an hour</p>
//           <p>If you dont reset your password within an hour, you must submit a new password reset request</p>
//           <p>Sincerely,</p>
//           <p>Achilles Drill Team</p>
//           <p style="text-align:center">Need futher assistance ? </p>
//           <p style="text-align:center">contact administrator @ achillesdrill@gmail.com</p>
//         </div>
//         `});
//         return res.status(200).json({successMessage : 'Email was sent successfully check your email'})
//       })
//       }).catch(() => {
//         return res.status(500).json({errorMessage : 'something went wrong, please try again.'})
//       })
//    })
// });

// router.post('/new_password', (req, res) => {
//  const {password, token} = req.body;
//  User.findOne({resetPasswordToken : token, expireToken : {$gt : Date.now()}}).then((user) => {
//    if(!user){return res.status(400).json({errorMessage : 'Reset password link session has expired'})};
//     bcrypt.hash(password, 10).then((hashedPassword) => {
//     user.password = hashedPassword;
//     user.resetPasswordToken = undefined;
//     user.expireToken = undefined;
//     user.save().then(() => {
//         return res.status(200).json({successMessage : 'Password reset was successful'})
//     })
//    }).catch(() => {
//        return res.status(500).json({errorMessage : 'something went wrong, please try again.'})
//    })
//  })
// })


// router.get('/allUsers', authenticateJwt,  async(req, res)=>{
//   try {
//     const allUsers = await User.find().sort({level : 1});
//    return res.status(200).json(allUsers);
//   } catch (error) {
//     res.status(500).json({errorMessage: 'Something went wrong while fetching user'});
//   }
// });

// router.delete('/deleteUser/:id', authenticateJwt, async (req, res) => {
//   const _id = req.params.id;
// try {
//   const deletedUser = await User.deleteOne({_id}).exec();
    
//   if(deletedUser.deletedCount === 0){
//      return res.status(404).json({errorMessage : `User With ID ${_id} does not Exist`});
//   }else{
//      res.status(200).json({successMessage : `User With ID ${_id} Was Successfully Deleted`});
//   }
// } catch (error) {
//   res.status(500).json({errorMessage: 'Something went wrong while fetching user'});
// }
// })

// router.get('/getUser/:id', authenticateJwt, async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findOne({_id});
//     if(!user){
//       return res.status(404).json({errorMessage : `Question With ID ${_id} Does Not Exist`});
//     }else{
//       return res.status(200).json(user);
//     } 
//   } catch (error) {
//     res.status(500).json({errorMessage: 'Something went wrong'});
//   }
// })

// router.put('/updateUser/:id', authenticateJwt, async (req, res) => {
//   const { username, matric, level, email, role } = req.body;
//   const _id = req.params.id;

// try {
//   let user = await User.findOne({_id});

//   if(!user){
//       res.status(400).json({errorMessage : `User with ID ${_id} was not found`});
//   }else{
//       user.username = username;
//       user.matric = matric;
//       user.level = level;
//       user.email = email;
//       user.role = role;
//       await user.save();
//      return res.status(200).json({successMessage : `User data was successfully updated`});
//   }
//  } catch (error) {
//   res.status(500).json({errorMessage: 'Something went wrong'});
//  }
// });


// router.post('/createTestimonies', authenticateJwt, upload.single('NimelssaiteImage'), async (req, res)=>{
//   const { username, level, comment } = req.body;
//   const {filename} = req.file;
//   try {
//     let testimony = new Testimonies();
//     testimony.fileName = filename;
//     testimony.username = username;
//     testimony.level = level;
//     testimony.comment = comment;

//     await testimony.save();

//     res.status(200).json({successMessage : 'New Story was successfully published'});
//   } catch (error) {
//     res.status(500).json({errorMessage : 'Something went wrong, Please try again.'});
//   }
  
// });
  
// router.get('/allTestimonies', async (req, res)=>{
//   try {
//    const allTestimonies = await Testimonies.find({}).limit(4).sort({date : 1}) //The limit helps to fetch limites amount of data fro MongoDb
//    return res.status(200).json(allTestimonies);
//   } catch (error) {
//    res.status(500).json({errorMessage : 'Something went wrong, Please try again.'});
//   }
// });

// router.post('/approveMatric', authenticateJwt, async (req, res) => {
//   const {matric, level} = req.body;
//   try {
//     const user = await ApprovedMatric.findOne({matric});
//     if (user) {
//      return res.status(400).json({ errorMessage: `User with matric ${matric} already exist` });
//     }

//     const newApprovedMatric = new ApprovedMatric({level, matric});

//     await newApprovedMatric.save();

//     res.status(200).json({successMessage : `User with matric ${matric} was successfully approved`});
//   } catch (error) {
//     res.status(500).json({errorMessage : 'Something went wrong, Please try again.'});
//   }
// })

// router.get('/allMatrics', authenticateJwt,  async(req, res)=>{
//   try {
//     const allMatrics = await ApprovedMatric.find().sort({level : 1});
//    return res.status(200).json(allMatrics);
//   } catch (error) {
//     res.status(500).json({errorMessage: 'Something went wrong while fetching user'});
//   }
// });

  
// router.post('/oneUser', async(req, res) => {
//   let matric = req.body;      
//   console.log(matric);                                                                                                    
//   const singleUser = await User.findOne({matric}).select('-password');
//   if(!singleUser){
//     return res.status(404).json(`User with  matric ${matric} does not exist`);
//   }else{
//      return res.status(200).json(_.pick(singleUser, ['username', 'matric', 'role']));
//   }
// }); 

module.exports = router;
