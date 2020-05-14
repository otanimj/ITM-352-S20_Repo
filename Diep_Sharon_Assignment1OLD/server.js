//isNonNegInt function was drawn from Lab 13
function isNonNegInt(q, returnErrors = false) {
   errors = []; // assume that quantity data is valid 
   if (q == "") { q = 0; } //this means that the blank values will be handle as if they were 0
   if (Number(q) != q) errors.push('<font color="red">This is Not a Number!</font>'); //check if value is a number
   if (q < 0) errors.push('<font color="red">This is a Negative Value!</font>'); //check if value is a positive number
   if (parseInt(q) != q) errors.push('<font color="red">This is Not an Integer!</font>'); //check if value is a whole number
   return returnErrors ? errors : (errors.length == 0);
}

//The following code allows for server side processing.
//Resources Used: Lab 13
const querystring = require('querystring');
var express = require('express'); //code for server
var myParser = require("body-parser"); //code for server
var products = require("./public/product_data.js").products; //accessing data from javascript file
var filename = 'user_data.json' //defines the array as an object 
var fs = require('fs'); //pulls data from product_data.js
var app = express();
var qstr = {};
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});

if (fs.existsSync(filename)) {
   stats = fs.statSync(filename) //this gets stats from the filename 
   data = fs.readFileSync(filename,'UTF-8');
   console.log(typeof data);
   users_reg_data = JSON.parse(data);

   console.log(`${filename} has ${stats.size} characters`);
} else {
   console.log("Hey!" + filename + "doesn't exist!")
}

app.use(myParser.urlencoded({ extended: true }));

app.post("/process_page", function (request, response) {
   //check for valid quantities
   //look up request.query
   console.log(request.body); 
   var params = request.body;
   if (typeof params['purchase_submit'] != 'undefined') {
      has_errors = false; // assume that quantity values are valid
      total_qty = 0; // check if there are values in the first place, so see if total > 0
      for (i = 0; i < products.length; i++) {
         console.log(i, params[`quantity${i}`]);
         if (typeof params[`quantity${i}`] != 'undefined') {
            a_qty = params[`quantity${i}`];
            total_qty += a_qty;
            if (!isNonNegInt(a_qty)) {
               has_errors = true; // see if there is invalid data
            }
         }
      }
      qstr = querystring.stringify(request.query);
      // redirect to invoice if quantity data is valid or respond to invalid data
      if (has_errors || total_qty == 0) {
         //redirect to products page if quantity data is invalid
         qstr = querystring.stringify(request.query);
         response.redirect("products_page.html?" + qstr);
      } else { //the quantity data is okay for the invoice
         response.redirect("invoice.html?" + qstr);
      }
   }
});
//if quantity data valid, send them to the login page
//isNonNegInt function was drawn from Lab 13
function isNonNegInt(q, returnErrors = false) {
   errors = []; // assume that quantity data is valid 
   if (q == "") { q = 0; } //this means that the blank values will be handle as if they were 0
   if (Number(q) != q) errors.push('This is Not a Number!'); //check if value is a number
   if (q < 0) errors.push('This is a Negative Value!'); //check if value is a positive number
   if (parseInt(q) != q) errors.push('This is Not an Integer!'); //check if value is a whole number
   return returnErrors ? errors : (errors.length == 0);
}

app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

//Sources: Lab13