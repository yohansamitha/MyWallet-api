const mongoose = require('mongoose');

let IncomeSchema = new mongoose.Schema({
    incomeName: {
        type: String,
        required: true,
        unique: true
    },
    userEmail: {
        type: String,
        required: true
    },
    incomeCategory: {
        type: String,
        required: true
    },
    incomeType: {
        type: String,
        required: true
    },
    time: {
        year: {
            type: Number,
            required: true
        },
        month: {
            type: String,
            required: true
        }
    },
    incomeStatus: {
        type: String,
        default: true
    },
    incomeAmount: {
        type: Number,
        required: true
    },
    incomeDescription: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Income', IncomeSchema);
