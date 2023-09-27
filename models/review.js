const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    reviewed_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    review_title: {
        type: String,
        required: true
    },
    review_text: {
        type: String,
        required: true
    }
    
}, {
    timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

//exports a constructor function which builds an instance of the model class