/* jshint esversion: 6 */
"use strict";

// requires
const json = require("json");
const shortid = require("shortid");
const cookieParser = require("cookie-parser");
const express = require("express");
const redis = require("redis");
const path = require("path");
const cors = require("cors");
const bodyParse = require("body-parser");

// create server and connectivity to redis db
const port = 3001;
const client = redis.createClient({host: "127.0.0.1", port: 6379});
const app = express();
app.use(cors());
app.use(bodyParse.json());
client.on("connect", function () {
    console.log("You are now connected");
});

/** This function is creating a user and inserting to db
 *  Status 75% complete.
 *  Problem right now
 *  1. check validy email works 50% of cases (email != remail works, if email exists not)
 *  2. doesn't send the error to user.. (sends to console instead)
 *  3. Cookies for the next() functions
 *  4. add next for user parameters not entered..
 */
app.post('/register', (req, res, next) => {
    // generate new id depending on the type of object in order in insert to first hash key
    let id = generateNewIDforObejct("user");
    // check validity of email if is not valid. go to next
    let emailVal = checkValitdyEmail(req.body.email, req.body.remail);
    if (emailVal !== true) {
        next(emailVal);
        return;
    }
    // check validity of password if is not valid. go to next
    let passVal = checkValidityPass(req.body.password, req.body.rpassword);
    if (passVal !== true) {
        next(passVal);
        return;
    }
    // creating a user
    let user = {
        password: req.body.password,// need encryption,
        name: req.body.name,
        email: req.body.email,
        logins: [], // contains date,hours in UTC, Local time
        purchases: [], //contains , purchase object that includes, items , prices, colors?, date, and after purchase clear cart
        cart: []        // should be in cookies?
    };
    // set the user into db , hashed
    client.hset('users', id, JSON.stringify(user), redis.print);
});
/**This function is called for by next , code is for the first option
 * validity of email
 * Problems mentioned in first section
 */
app.post('/register', (err, req, res, next) => {
    //not the same email entered
    if (err === "Not the same") {
        res.send("Not the same email");
        res.flush();
        return;
    }
    // email is taken
    if (err === "Taken") {
        res.send("This Email is taken");
        res.flush();
        return;
    }
    // other errors
    next(err);
});
/**This function is called by next, code is for second option
 * Validity of password
 * Problems mentioned in first section
 */
app.post('/register', (err, req, res) => {
    //error password leaglity + same pass
    // TOLEARN : redirect + pass or SHOWING HOW TO Show the illegality
    if (err === "illegal pass") {
        res.send(`this password is illegal, you must include at least
    - 1 digit (0-9)
    - 1 capital letter (A-Z)
    - 1 small letters (a-z)
    `);
        res.flush();
        return;
    }
    if (err === "not same pass") {
        res.send("Not the same password");
        res.flush();
        return;
    }
    // THIS SECTION IS FOR UNKNOWN ERRORS
    res.error("Unknown Error");
})
;
/**This function is for forgot my password
 * Status : 0% complete
 * reason : need to understand about get a key form value in db
 */
app.post('/forgotmypassword', (req, res) => {

});
/**This function is for forgot my password
 * Status : 0% complete
 * reason : need to understand few mechanics
 * cookies, authentication, how page is bulit.
 */
app.post('/resetpassword', (req, res) => {

});
/**This function is for logging in the user
 * Status: 50% complete
 * Problems:
 * 1. need to understand how I can get a key from value. and get a user from value of one of his fields
 * 2. password need to be hashed
 * 3. cookies
 * 4. personalized page (showing cart)
 */
app.post('/login', (req, res) => {
    let email = req.body.email;
    let pass = req.body.password;
    let key = "";// value form key
    let user = "";// get user..
    if (user.password === pass) {
        let date = new Date().toUTCString();
        user.logins[user.logins.length - 1] = date;
        // need timeout cookie
    }

});
/**Temp method for main page
 * maybe change to redirection to the main store?
 */

app.get('/', (req, res) => {
    res.send("Hello");
});

/** Adding a product to database
 *  Status: 100% complete
 *  SIDE NOTE-> num of votes is needed just for calcs
 */
app.get('/addproduct', (req, res) => {
    let id = generateNewIDforObejct("product");
    let product = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        image: req.body.image,//jpeg,png file
        color: req.body.color,// 6 digit hex
        rating: 0,
        sumratings: 0,
        numvote: 0,
    };
    client.hset('products', id, JSON.stringify(product));
});
/** Category filter..
 * many probs
 * Status: 0% complete
 */
app.get('/categories/general', (res, req) => {
});

/**Add item to cart
 * Status: 0% complete
 * 1.cookies
 * 2. many more
 */
app.post('', (req, res) => {
    //add items to cart..
    // TOLEARN : redirect + cookies
});
/**Calculator valid (need multiply and add)
 * Status: 0% complete
 * 1. need to check mult things before
 */
app.post('', (req, res) => {

});
/**Get all the products
 * Status: 100% complete
 */
app.post('/getAllProducts', (req, res) => {
    let products = getallProducts();
    res.send(products);
});

/**Get all the products from cat
 *  problems:
 *  1. url?
 *  2. post\get?
 *  Status: 40% complete
 */
app.post('/', (req, res) => {
    let products = getallProducts();
    res.send(products);
});
/**All those functions
 *  Status: 0% complete
 */
// three function needed , all the cart need to have object {product: prodObj , quantity: Number(int)}
// if quant === 0; pop message you want to remove from cart
/*
    1) add one to cart
    2) remove one from cart
    3) remove all from cart
 */

app.delete('/', (req, res) => {
    // remove item from cart
    // TOLEARN : cookies
});
app.delete('/', (req, res) => {
    // remove item from store
    // TOLEARN : redirect + cookies
});
/** Add rating votes
 *
 *  problems:
 *  1. how to get item
 *  2. get product from key
 *  Status: 0% complete
 */
app.post('', (req, res) => {

});

/** this function generate new key for user and products
 *  if we run into an old key it regenerate
 *
 * @param type - user \ product
 * @return {string|null}
 *  Status: 100% complete
 */
function generateNewIDforObejct(type) {
    let newID = shortid.generate();
    if (type === "user" || type === "product") {
        newID = type + "_" + newID;
    } else {
        return null;
    }
    // TODO edit to new DB usage
    while (!client.exists(newID)) {
        newID = type + "_" + shortid.generate();
    }
    return newID;
}

/** Checks if there is email in the db and the two mails that were entered are valid
 *
 * @param email - first email
 * @param remail - second email
 * @return {string|boolean}
 * Status: 50% complete
 */

function checkValitdyEmail(email, remail) {
    if (email !== remail) {
        return "Not the same";
    }
    return getAllParamsOfObj("user", "email").findIndex(user => user.email === email) === -1;
}

/** Checks if the pasword given is valid and the two password are identical
 *
 * @param passA - the first password
 * @param passB - the second password
 * @return {string|boolean}
 * Status: 100% complete
 */
function checkValidityPass(passA, passB) {
    // for the real change to 6
    if (passA === passB && passA.length >= 3) {
        if (passA.toLowerCase() !== passA && passA.toUpperCase() !== passA && /\d/.test(passA) !== false) {
            return true;
        }
        return "illegal pass";
    }
    return "not same pass";
}

/**
 * this function retrives all the data of a certain field of a certain type
 * example, all the emails of users, all the prices of product
 * @param type = can be user\product; otherwise null
 * @param field = a respective field of the type
 * @return  {null|*[]} =a mapped array of all param wanted
 * status: 40% complete
 **/
function getAllParamsOfObj(type, field) {
    let arr = [];
    if (type === "user" || type === "product") {
        client.hgetall(type + 's', function (err, results) {
            if (err) {
                console.log(err);
            } else {
                // some opp here
                arr.concat(results);
            }
        });
        console.log(JSON.stringify(arr));
        return arr.map(type => type[field]);
    }
    return null;
}

/** this function does the same as above but maps differntly
 *
 * @param type
 * @param field
 * @return {null|*[]}
 * Status: 20% complete
 */
function getAllParamsOfObjwithKey(type, field) {
    let arr = [];
    if (type === "user" || type === "product") {
        client.hgetall(type + 's', function (err, results) {
            if (err) {
                console.log(err);
            } else {
                // some opp here
                arr.concat(results);
            }
        });
        console.log(JSON.stringify(arr));
        //need to edit
        return arr.map(type => [id, type[field]]);
    }
    return null;
}

/** this function does the same as above but maps differntly
 *
 * @param type
 * @param field
 * @return {null|*[]}
 * Status: 20% complete
 */

function getAllParamsOfObj2fieldsandKey(type, field, field2) {
    let arr = [];
    if (type === "user" || type === "product") {
        client.hgetall(type + 's', function (err, results) {
            if (err) {
                console.log(err);
            } else {
                // some opp here
                arr.concat(results);
            }
        });
        console.log(JSON.stringify(arr));
        //need to edit
        return arr.map(type => [id, type[field]]);
    }
    return null;
}

/**this function returns all the products
 * @returns {Error}
 */
function getallProducts() {
    client.hgetall('products', function (err, results) {
        if (err) {
            console.log(err);
        } else {
            return results
        }
    });
    return new Error();
}

/**this function returns all the item belongs to a category
 *
 * @param category - the chosen category
 * @returns {*[]}- an array of products
 */
function getallinCategoryProducts(category) {
    let arr = [];
    /*
    get all items as array
     */
    client.hgetall('products', function (err, results) {
        if (err) {
            console.log(err);
        } else {
            // results to array
        }
    });
    // concat the array with res
    arr.concat();
    let ans = arr.filter(product => product.category === category);
    return ans;
}

/**returns the password
 *
 * @param user
 * Status: 20% complete
 * need to hash the password and authentication
 */
function passwordret(user) {
    return user.password;
}

/** updating the rating
 *
 * @param product - the product given a rating
 * @param rating - the new rating given by user
 * Status: 90% complete
 * problem : need to lock somehow the user from double voting
 */
function updateRating(product, rating) {
    product.sumratings += rating;
    product.numvote += 1;
    product.rating = product.sumratings / product.numvote;

}

// Server listening
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});


