const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || process.env.USER_PORT;

const UserRoutes = require("./routes/UserRoute");
const IncomeRoutes = require('./routes/IncomeRouts');
const ExpensesRoutes = require('./routes/ExpensesRouts');

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(cors());

mongoose.connect(
    'mongodb+srv://admin1user:adminuser1@cluster0.fqtep.mongodb.net/mywallet?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
).then(() => {
    console.log('mongoose connection successful')
    app.listen(port, () => {
        console.log(`server app is lisining in ${port} port!`);
    });

}).catch((error => {
    console.log(error);
}))

app.use("/api/v1/userRoute", UserRoutes);
app.use("/api/v1/incomeRoute", IncomeRoutes);
app.use("/api/v1/expensesRoute", ExpensesRoutes);
