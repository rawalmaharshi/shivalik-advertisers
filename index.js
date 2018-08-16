const express = require('express');
const hbs = require('hbs');

const port = process.env.PORT || 5000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.render('../index.hbs', {
        pageTitle: 'Shivalik Advertisers | Home'
    });
});

app.get('/about', (req, res) => {
    res.render('../about.hbs', {
        pageTitle: 'Shivalik Advertisers | About'
    });
});

app.get('/contact', (req, res) => {
    res.render('../contact.hbs', {
        pageTitle: 'Shivalik Advertisers | Contact'
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
