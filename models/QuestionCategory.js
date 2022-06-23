const mongoose = require('mongoose');

const QuestionCategorySchema = new mongoose.Schema({
    category : {
        type : String,
        required : true,
        lowercase : true,
        unique : true
    }
}, {timestamps : true});

const QuestionCategory = mongoose.model('Category', QuestionCategorySchema);

module.exports = QuestionCategory;