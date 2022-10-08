const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require("jsonwebtoken");
var crypto = require('crypto');
const Razorpay = require('razorpay');
const mongoose = require("mongoose");
require("dotenv").config();
const Recharging = require("./models/Recharging");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const db = process.env.DB_DEV;
const app = express();
const port = process.env.PORT || 7777;
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected: ", app.settings.env))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());


app.use(express.static(path.join(__dirname, 'build')));


app.post('/recharge', async (req, res) => {
  if (!req.body.money
    || !req.body.name || !req.body.email) {
    res.send("Mandatory fields missing");
  } else {
    var pd = req.body;
    const comp = {};
    comp.user = req.body.name;
    comp.money = req.body.money;
    comp.email = req.body.email;
    //from lottery => recharge._id
    //from shop => address
    comp.recharge = req.body.address;
    comp.status = req.body.status;
    comp.productinfo = req.body.productinfo ? req.body.productinfo : "Shopping carts";
    const recharging = await new Recharging(comp).save();   
    var hashString = process.env.PAYU_KEY 
      + '|' + recharging._id
      + '|' + recharging.money + '|' + recharging.productinfo + '|'
      + recharging.user + '|' + recharging.email
      + '|||||||||||'
      + process.env.PAYU_SALT; // Your salt value
    var cryp = crypto.createHash('sha512');
   
    cryp.update(hashString);
    var hash = cryp.digest('hex');
      // console.log(hash);
      // console.log(JSON.stringify(hash));
    res.send({ 'hash': hash, "recharging": recharging, key: process.env.PAYU_KEY, url: process.env.APP_URL + "/response" });
  }

});

app.post('/response', async function (req, res) {
  var pd = req.body;
  //Generate new Hash 
  var hashString = process.env.PAYU_SALT + '|' + pd.status + '|||||||||||' + pd.email + '|' + pd.firstname + '|' + pd.productinfo + '|' + pd.amount + '|' + pd.txnid + '|' + process.env.PAYU_KEY;
  var cryp = crypto.createHash('sha512');
  cryp.update(hashString);
  var calchash = cryp.digest('hex');
  // Verify the new hash with the hash value in response
  if (calchash == pd.hash && pd.status== 'success' && pd.unmappedstatus=='captured' && pd.error=='E000') {
    const recharging = await Recharging.findById(pd.txnid).catch(err => {
      console.log('recharging failed');
      return res.send({ 'status': "Error occured" });
    });
    let token;
    if (recharging.status == 1) {
      token = jwt.sign(
        {
          recharge: recharging.recharge,
          money: pd.amount,
          order: pd.mihpayid
        },
        process.env.AUTH_SECRET,
        {
          expiresIn: "1h",
        }
      );
      return res.redirect("https://www.terion.club/api/response-recharge/" + token);
    }
    
    res.redirect("/");
  } else {
    res.send({ 'status': "Error occured" });
  }

  

});
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(port, error => {
  if (error) throw error;
  console.log('Server running on port' + port);
})
