require('./server/config/config');

const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient;

function ProductsDAO (db) {
  "use strict";

  this.db = db;

  this.getCategories = (callback) => {
    "use strict";

    var categories = [];
    var total = 0;
    var category = {
      _id: "All",
      noOfProducts: 3
    };

    categories.push(category);

    this.db.db().collection('products1').aggregate([ { $group: { _id: '$category', noOfProducts: { $sum: 1 } } }, { $sort: { _id: 1 } } ]).toArray(function(err, docs) {
      if (err) {
          throw err;
      }

      // docs is array of our categories and count so now need to push it into categories array
      docs.forEach(function(product) {
          // format category with product details and push into categories array
          var productCat = _.clone(category);
          // console.log(productCat);
          productCat._id = product._id;
          productCat.noOfProducts = product.noOfProducts;
          total += product.noOfProducts;
          categories.push(productCat);
      });
      // now update the total for our all category
      categories[0].noOfProducts = total;
      console.log(categories);

      // console.log('categories', categories);
      callback(categories);
    });
  }

  this.getProducts = (category, callback) => {
    "use strict";

    var category = category;
    console.log(category);
    var products = [];

    var product = {
      "_id": 1,
      "prod_id": "CST123",
      "title": "PediaSure Coaser Toad",
      "slogan": "Coaster to prevent blemishes on your valued table",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed sem vel dolor tempus molestie ut non ex. Suspendisse ut est sit amet lorem tempor luctus. Proin nunc tellus, posuere eget sodales non, vehicula nec erat. Vestibulum dolor lectus, ultrices et rutrum id, porta id sapien. Etiam vulputate fringilla convallis. Aenean vel metus at nisl volutpat elementum vitae non leo. Phasellus rutrum vehicula condimentum. Aliquam semper feugiat molestie.",
      "category": "Coaster",
      "img1_url": "/img/1.jpg",
      "img2_url": "/img/2.jpg",
      "img3_url": "/img/3.jpg",
      "price": 200.0
    };


  // show all products if the category filter is empty
    if (category.length == 0) {
      this.db.db().collection('products').find( {} ).sort({ _id: 1 }).toArray(function(err, docs) {
        if (err) {
            throw err;
        }
        docs.forEach(function(product) {
            products.push(product);
        });

        callback(products);
      });
    } else { // handle all other categories
        this.db.db().collection('products').find( {category: category }).sort({ _id: 1 }).toArray(function(err, docs) {
          if (err) {
              throw err;
          }

          docs.forEach(function(product) {
              products.push(product);
          });

          callback(products);
        });
    }
  }

  this.getProduct = (prod_id, callback) => {
    "use strict";
    this.db.db().collection('products').findOne({ prod_id: prod_id }, function(err, doc) {
            if (err) {
                throw err;
            }

            callback(doc);
        });
  }
}

module.exports.ProductsDAO = ProductsDAO;
