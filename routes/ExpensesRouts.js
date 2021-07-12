const express = require('express');
const expensesController = require('../controllers/ExpensesController');

const router = express.Router();

router.post('/addExpense', expensesController.addExpenses);
router.get('/getAllExpense', expensesController.getAllExpenses);
router.put('/updateExpense', expensesController.updateExpenses);
router.delete('/deleteExpense', expensesController.deleteExpenses);

module.exports = router;
