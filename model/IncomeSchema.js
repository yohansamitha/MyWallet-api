const mongoose = require('mongoose');

let IncomeSchema = new mongoose.Schema({
    incomeName: {
        type: String,
        required: true
    },
    incomeType: {
        type: String,
        required: true
    },
    incomePrice: {
        type: Number,
        required: true
    },
    income: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Income', IncomeSchema);
