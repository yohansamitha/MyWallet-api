const express = require('express');
const incomeController = require('../controllers/IncomeController');

const router = express.Router();

router.post('/addIncome', incomeController.addIncome);
// router.get('',);
// router.put('',);
// router.delete('',);

module.exports = router;
