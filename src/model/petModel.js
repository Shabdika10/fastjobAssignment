const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: ""
    },
    type: {
        type: String,
        trim: true,
        default: ""
    },
    breed: {
        type: String,
        trim: true,
        default: ""
    },
    age: {
        type: Number,
        trim: true,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('petDetail', petSchema);