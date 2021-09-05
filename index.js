require('dotenv').config();

const express = require('express');
const app = express();

// Set up view engine
app.set('view engine', 'ejs');

// Create home route
app.get('/', (req, res) => {
    res.render('home');
});

// Load anything under assets folder upon request
app.use('/assets', express.static(__dirname + '/assets'));

// Listens on port 443
app.listen(process.env.PORT, () => {
    console.log(`Now listening for requests on port ${process.env.PORT}!`);
});