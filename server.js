require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log(`Connected to MongoDB😍😍😍 ... `) )
  .catch(() => console.log(`Could not Connect to MongoDB ... `) );
            

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

    app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});



let urlSchema = new mongoose.Schema({
  long: {type: String, required: true},
  short: Number
})

Url = mongoose.model("Url", urlSchema);
let bodyParser = require('body-parser')


let shorty = 1;




app.post('/api/shorturl/new', bodyParser.urlencoded({extended: false}) , (req, res) => {
  let urls = req.body.url 
  let jojo = new Url({long: urls, short: shorty+=1}) 

  jojo.save((err,data) => {
    if(err)return console.error(err);
  })

  res.json({"original_url":urls,"short_url":shorty})
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

app.get('/api/shorturl/:word', (req,res) => {
  console.log(req.params.word);
  let thingToFind = req.params.word;
  Url.find({short: thingToFind}, (err,data) => {
    if(err)return console.error(err);
    res.redirect(data[0].long);
  })
})

