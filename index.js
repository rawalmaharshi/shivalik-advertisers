require('./server/config/config');
const ProductsDAO = require('./products').ProductsDAO;

const express = require('express');
const hbs = require('hbs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const _ = require('lodash');

const port = process.env.PORT;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');

// hbs.registerHelper('categs', function(items, options) {
//   var out = "<ul>";
//
//   for(var i=0, l=items.length; i<l; i++) {
//     out = out + "<li>" + options.fn(items[i]) + "</li>";
//   }
//
//   return out + "</ul>";
// });

app.set('view engine', 'hbs');

app.use(express.static(__dirname));

//Using Mongodb connection here and sending db object to every call to get products / category etc
MongoClient.connect(process.env.PROD_MONGODB, { useNewUrlParser: true }, function(err, db) {
    "use strict";

    if(err) {
      console.log(`Error connection to db: ${err}`);
    }

    var products = new ProductsDAO(db);

    app.get('/', (req, res) => {
      res.render('../index.hbs', {
          pageTitle: 'Shivalik Advertisers | Home'
      });
    });

    app.get('/about', (req, res) => {
      res.render('about.hbs', {
          pageTitle: 'Shivalik Advertisers | About'
      });
    });

    app.get('/contact', (req, res) => {
      res.render('contact.hbs', {
          pageTitle: 'Shivalik Advertisers | Contact'
      });
    });

    app.get('/products', (req, res) => {

      var category = req.query.category ? req.query.category : "All";

      products.getCategories(function (categories) {
        products.getProducts(category, function (products) {
          // console.log(`Categories: ` + JSON.stringify(categories));
          // console.log(`Products: ` + JSON.stringify(products));

          res.render('products.hbs', {
              pageTitle: 'Shivalik Advertisers | Products',
              categories: categories,
              products: products
          });
        });
      });
    });

    app.get('/products/:category/:prod_id', (req, res) => {
      var product_id = req.params.prod_id;
      var category = req.params.category;
      console.log(product_id, category);

      products.getProduct(product_id, function (product) {
        console.log(product);
        res.render('product_page.hbs', {
          pageTitle: 'Shivalik Advertisers',
          product: product
        });
      });
    });

    app.listen(port, () => {
      // console.log(process.env);
      console.log(`Server started on port ${port}`);
    });

  });
