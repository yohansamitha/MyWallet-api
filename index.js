const exprers = require("express");
const app = exprers();
const port = 3000;

app.get("/", (req, res) => {
   res.send("Hello World");
});

app.listen(port, () => {
   console.log("server app is lisining in 3000 port");
});
