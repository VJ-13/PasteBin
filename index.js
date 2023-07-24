// Importing the modules
const mongoose = require('mongoose');
const express = require('express');
const app = express();
require('dotenv').config();

// Importing the schema
const Document = require('./models/Document');

// Setting up the view engine
app.set('view engine', 'ejs');

// Setting up the middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// Connecting to the MongoDB 
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => { console.log('Connected to Mongoose');}).catch((err) => {console.log(err);});

// Get route for the home page
app.get('/', (req, res) => {
    const code = `Welcome to the PasteBin!
    
Use the commands in the top right corner 
to create a new file, save it, and duplicate it.`

    res.render("code-display", {code, language: 'plaintext'});
});

// Get route for the new file page
app.get('/new', (req, res) => {
    res.render('new-file');
});

// Post route for the save button
app.post('/save', async(req, res) => {
    const value = req.body.value;
    try{
        const document = await Document.create({value});
        res.redirect(`/${document.id}`);
    }catch(err){
        res.render('new-file', {value: value});
    }
});

// Get route for the code display page based on the id
app.get('/:id', async(req, res) => {
    const id = req.params.id;
    try{
        const document = await Document.findById(id);
        res.render('code-display', {code: document.value, id});
    }
    catch(err){
        res.redirect('/');
    }
});

// Get route for the duplicate button
app.get('/:id/duplicate', async(req, res) => {
    const id = req.params.id;
    try{
        const document = await Document.findById(id);
        res.render('new-file', {value: document.value});
    }
    catch(err){
        res.redirect(`/${id}`);
    }
});

// Get route for the just text button
app.get('/:id/just-text', async(req, res) => {
    const id = req.params.id;
    try{
        const document = await Document.findById(id);
        res.render('just-text', {value: document.value});
    }
    catch(err){
        res.redirect(`/${id}`);
    }
});

// App listening on port 3000
app.listen(3000, () => {console.log('Server is listening on port 3000');});