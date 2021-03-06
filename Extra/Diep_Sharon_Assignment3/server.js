//Author: Sharon Diep
//The following code is my server page where it tells the computer what to do and where to go. The following should enable the user to go from he home page to products page to login or registration then to the invoice page.--> 
//Referenced from server side processing labs with app.get and app.post examples. 

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
var products = require("./public/product_data.js","./public/product_data2.js", "./public/product_data3.js", "./public/product_data4.js", "./public/product_data5.js").products; //accessing data from javascript file
var filename = 'user_data.json' //defines the array as an object 
var fs = require('fs'); //pulls data from product_data.js
var app = express();
var qs = require('querystring'); //for the quantities to be carried over
var qstr = {};
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});

var cookieParser = require(`cookie-parser`);
app.use(cookieParser());

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
      qstr = querystring.stringify(request.body);
      // redirect to invoice if quantity data is valid or respond to invalid data
      if (has_errors || total_qty == 0) {
         //redirect to products page if quantity data is invalid
         console.log("going to products page", has_errors, total_qty);
         response.redirect("/products_page.html?" + qstr);
      } else { //the quantity data is okay for the invoice
         console.log("going to login page");
         response.redirect("/login.html?" + qstr);
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

fs = require('fs'); // uses file system moduel

//open file if it exists, if it doesn't don't open it
if (fs.existsSync(filename)) {
   stats = fs.statSync(filename) //this gets stats from the filename 
   data = fs.readFileSync(filename,'UTF-8');
   console.log(typeof data);
   users_reg_data = JSON.parse(data);
}


    function isNonNegInt(q, return_errors = false) {
        errors = [];
        if (q == '') q = 0;
        if (Number(q) != q) errors.push('<font color="red">Please put a number.</font>'); //check if value is a number
        else if (q < 0) errors.push('<font color="red">Please put a positive value.</font>'); //check if value is a positive number
        else if (parseInt(q) != q) errors.push('<font color="red">Please put a whole number.</font>'); //check if value is a whole number
        return return_errors ? errors : (errors.length == 0);
    }

app.post("/check_login", function (request, response) {
   // Process login form POST and redirect to logged in page if ok, back to login page if not
   console.log(request.query, request.body);
   the_username = request.body.username;
   console.log(the_username, "username is", typeof (users_reg_data[the_username]));
   //validate login data
   theQuantQuerystring = qs.stringify(request.query);
   if (typeof users_reg_data[the_username] != 'undefined') {
      //To check if the username exists in the json data
      if (users_reg_data[the_username].password == request.body.password) {
         //make the query string of prod quant needed for invoice
         response.redirect('/invoice.html?' + theQuantQuerystring + `&username=${the_username}`);
         return;
      } else { 
         response.redirect('/login.html?' + theQuantQuerystring); // redirects to the login page when login was invalid
      }
   }
   response.send(`${username} registered!`); 
   response.redirect('/invoice.html?' + theQuantQuerystring + `&username=${the_username}`); // redirects to the login page when login was invalid
});

app.post("/register_user", function (request, response) {
   // process a simple register form
   console.log(request.query, request.body);
   the_username = request.body.username.toLowerCase();
   console.log(the_username, "username is", typeof (users_reg_data[the_username]));

   username = request.body.username;//saves new username to file name (users_reg_data)

   errors = [];//checks to see if username already exists

   //Check if username is valid
   if (typeof users_reg_data[username] != 'undefined') {
      errors.push("Username is Already Taken. Please Enter a Different Username."); // tells us in the terminal the errors
      console.log(errors, users_reg_data); 
   } else {
      users_reg_data[username] = {}; // if there are no errors with username it is now valid 
   } 
   //check if password matches
   if (request["body"]["password"] != request["body"]["password"]) {
      errors.push("Password does not match! Please re-enter correct password.")
   } else {
      users_reg_data[username].password = request["body"]["password"];
   }
   request.query.error = errors;
   theQuantQuerystring = qs.stringify(request.query); // define querystring variable
   console.log(theQuantQuerystring);
   if (errors.length == 0) { // if there are no errors with the followin write the new data in data file
      users_reg_data[username] = {};
      users_reg_data[username].name = request.body.name;
      users_reg_data[username].password = request.body.password;
      users_reg_data[username].email = request.body.email;
   
      fs.writeFileSync(filename, JSON.stringify(users_reg_data));
      console.log(theQuantQuerystring, "going to invoice");
      response.redirect('/invoice.html?' + theQuantQuerystring + `&username=${the_username}`); // redirect the page to invoice if the registration was successful 
      return;
   } else {
      console.log(errors);
      response.redirect(`/registration.html?` + theQuantQuerystring); // reboot the user to registration if not valid and keep the querystring of quantities 
   } 
});

app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

//Resources Used: Lab13 & Lab 14