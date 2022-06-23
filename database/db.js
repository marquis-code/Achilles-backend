const mongoose = require('mongoose');
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
let MONGOURI =
  "mongodb+srv://AchillesDrill:AchillesDrill2022@achilles.it0eh.mongodb.net/?retryWrites=true&w=majority";
const connectDB = async () => {
    try {
        await mongoose.connect(MONGOURI, dbOptions);
        console.log('Connection to database was successful');
    } catch (error) {
        console.log('Connection to MongoDB Failed', error);
    }
}
module.exports = connectDB;


/* 
username = AchillesDrill
password = AchillesDrill2022
*/