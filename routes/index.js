var express = require('express');
var router = express.Router();
const stripe = require('stripe')('sk_test_51JnJ0rDcZQfj0PinaWj04x9AYLubjTyMLZKNMlhYQlkauKhQ8ITp0pHLTVBQwvyJjzfekVD2lW2XsFuy1hZwnInm009ZXDWim1')




router.post('/create-checkout-session', async (req, res) => {
  let stripeItems = []
  
  for(let i=0;i<req.session.dataCardBike.length;i++){
    stripeItems.push({
      price_data: {
        currency: 'eur',
        product_data: {
          name: req.session.dataCardBike[i].name,
        },
        unit_amount: req.session.dataCardBike[i].price * 100,
      },
      quantity: req.session.dataCardBike[i].quantity,
    });
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: stripeItems,
    mode: 'payment',
    success_url: 'http://localhost:3000/confirm',
    cancel_url: 'http://localhost:3000/',
  });

  res.redirect(303, session.url);
});

var dataBike = [
  {name:"BIK045", url:"/images/bike-1.jpg", price:679},
  {name:"ZOOK07", url:"/images/bike-2.jpg", price:999},
  {name:"TITANS", url:"/images/bike-3.jpg", price:799},
  {name:"CEWO", url:"/images/bike-4.jpg", price:1300},
  {name:"AMIG039", url:"/images/bike-5.jpg", price:479},
  {name:"LIK099", url:"/images/bike-6.jpg", price:869},
]



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {dataBike});
});

router.get('/shop', function(req, res, next) {
 
  if(req.session.dataCardBike == undefined){
    req.session.dataCardBike = []
    }

  let bikeSelected = req.query.name
  let priceSelected = req.query.price
  let urlSelected = req.query.img

  let bikeAddToShop = {name: bikeSelected, url: urlSelected, price: priceSelected, quantity: 1, fdp: 30}

  const index = req.session.dataCardBike.findIndex(elem => elem.name === bikeAddToShop.name)
  if(index === -1) {
    req.session.dataCardBike.push(bikeAddToShop)
  } else {
    req.session.dataCardBike[index].quantity +=1
  }

  res.render('shop', { dataCardBike:req.session.dataCardBike});
});

router.get('/delete-shop', function(req, res, next) {
  let position = req.query.position
  req.session.dataCardBike.splice(position, 1)
  res.render('shop', {dataCardBike:req.session.dataCardBike});
});

router.post('/update-shop', function(req, res, next) {
  let position = req.body.position
  let quantity = req.body.quantity
  req.session.dataCardBike[position].quantity = quantity
  res.render('shop', {dataCardBike:req.session.dataCardBike});
});

router.get('/confirm', function(req, res, next) {
  res.render('confirm');
});
module.exports = router;
