require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
}).then(() => console.log(`Connected to MongoDB😍😍😍 ... `) )
  .catch(() => console.log(`Could not Connect to MongoDB ... `) );
            

// Basic Configuration
const port = process.env.PORT;

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
let bodyParser = require('body-parser');






app.post('/api/shorturl/new', bodyParser.urlencoded({extended: false}) , (req, res) => {
  let urls = req.body.url 
  let responseObject = {};
  responseObject['original_url'] = urls;

  let shorty = 1;




  Url.findOne({}).sort({short: 'desc'}).exec((err, data) => {
    if(!err && data != undefined){
      shorty = data.short + 1;
    }
    if(!err){
      mongoose.set('useFindAndModify', false); 
      Url.findOneAndUpdate(
        {long: urls}, {long: urls, short: shorty}, {new: true, upsert: true}, (error, savedUrl) => {
          if(!error){{
            responseObject['short_url'] = savedUrl.short;
            res.json(responseObject);
          }}

        }

      )
    }
  })
})

app.get('/api/shorturl/:word', (req,res) => {
  console.log(req.params.word);
  let thingToFind = req.params.word;
  Url.find({short: thingToFind}, (err,data) => {
    if(err)return console.error(err);
    res.redirect(data[0].long);
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


