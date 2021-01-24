const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const app = express();
mongoose.connect('mongodb://localhost:27017/mynode', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, );

app.use(express.json())

app.use('/', routes);




app.use('*', (req, res, next) => { res.status(404).json({ err: 'Not Found' }); })


app.use((err, req, res, next) => {
    // Map the error and send it to user
    // instanceof
    // Check if this err is a mongoose err using instanceof
    //console.error(err);
    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(422).json(err.errors);
    }
    if (err.code === 11000) {
        res.status(422).json({ statusCode: 'ValidationError', property: err.keyValue });
    }
    if (err.message === 'UN_AUTHENTICATED') {
        res.status(401).json({ statusCode: 'UN_AUTHENTICATED' });
    }
    res.status(503).end();
});





const { PORT = 3000 } = process.env;

app.listen(PORT, () => { console.log('app is running ', PORT) })