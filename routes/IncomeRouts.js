const express = require('express');
const incomeController = require('../controllers/IncomeController');

const router = express.Router();

router.post('/addIncome', incomeController.addIncome);
router.get('/getAllIncome', incomeController.getAllIncome);
router.put('/updateIncome', incomeController.updateIncome);
router.delete('/deleteIncome', incomeController.deleteIncome);

module.exports = router;
