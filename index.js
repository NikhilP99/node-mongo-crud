const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors')

mongoose.Promise = global.Promise;

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const url = "mongodb+srv://test:test@cluster1-n60yg.mongodb.net/sample_airbnb?ssl=true&authSource=admin&retryWrites=true&w=majority"

//Connecting to the database
mongoose.connect(url,{useNewUrlParser: true}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


var Schema = mongoose.Schema;
var Mflix = mongoose.model('Mflix', 
               new Schema({
                   title : String,
                   content: String
               }), 
               'testWrite');  


app.get('/', (req, res) => {
    Mflix.find({}, (err, data) => {
        res.json(data)
    })
});


app.post('/create', (req,res) => {

    var write = new Mflix({
        title: req.body.title || "Untitled Note", 
        content: req.body.content
    });
    write.save().then(data => {
        res.send(data)
    })
})

app.post('/update', (req,res) => {
    
    Mflix.update({title: req.body.toChange}, {
        title: req.body.title, 
        content: req.body.content, 
    }, function(err, data) {
       res.send(data)
    })
})

app.post('/delete/:title', (req,res) =>{
    Mflix.deleteOne({title: req.params.title}, data =>{
        res.send(data)
    })
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
    
});