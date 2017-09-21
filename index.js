const express = require('express');
const app = express();

app.get('/', (req,res) => {
    // console.log(req);
    res.send({ title: 'root' });
});

app.get('/movie', (req,res) => {
    // console.log(req);
    res.send({ title: 'Movie' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);