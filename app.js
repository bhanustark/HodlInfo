require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const https = require("https");

const Result = require(__dirname + '/models/result.js');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose.connect(process.env.DB);

app.get("/update", function(req, res){

  https.get('https://api.wazirx.com/api/v2/tickers', function(response) {
    response.setEncoding("utf8");
    let fullBody = "";

    response.on("data", function(data) {
      fullBody += data;
    });

    response.on("end", function() {

      const json = JSON.parse(fullBody);
      let arr = [];
      let i = 0;

      for (var key in json) {
        if (i==10) continue;

        Result.deleteMany({}, () => console.log("delete old data"));

        const result = new Result({
          base_unit: json[key].base_unit,
          quote_unit: json[key].quote_unit,
          low: json[key].low,
          high: json[key].high,
          last: json[key].last,
          type: json[key].type,
          open: json[key].open,
          volume: json[key].valume,
          sell: json[key].sell,
          buy: json[key].buy,
          at: json[key].at,
          name: json[key].name
        })

        result.save().then(() => console.log("Added record to database"));

        i++;
      }

    });

  });

  res.redirect("/");
});

app.get("/", function(req,res) {
  Result.find({}, function(err, foundData) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundData);
      if (foundData.length === 0) {
        res.redirect("/update");
      } else {
      res.render("home", {viewData: foundData});
      }

    }
  })

})


app.listen('3000', function() {
  console.log("Server has been started on 3000 port");
});
