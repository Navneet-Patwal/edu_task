const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const schoolRoutes = require('./routes/school')
app.use(bodyParser.json());
app.use('/',schoolRoutes);


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});