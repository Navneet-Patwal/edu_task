const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json()); 
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;
const schoolRoutes = require('./routes/school')


app.get('/', (req, res) => {
    res.send('Hello World!')
}
)
app.use('/',schoolRoutes);


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});