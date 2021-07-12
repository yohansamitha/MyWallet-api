const mongoose = require('mongoose');

let ExpensesSchema = new mongoose.Schema({
    expensesName: {
        type: String,
        required: true,
        unique: true
    },
    userEmail: {
        type: String,
        required: true
    },
    expensesCategory: {
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
    paymentMethod: {
        type: String,
        default: true
    },
    expensesStatus: {
        type: String,
        default: true
    },
    expensesAmount: {
        type: Number,
        required: true
    },
    expensesDescription: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('expenses', ExpensesSchema);
