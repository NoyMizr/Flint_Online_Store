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
const session = require("express-session");
const connectRedis = require("connect-redis");
const fetch = require("node-fetch");

// const bcrypt = require("bcrypt");
// const cryptoJs = require("crypto-js");
const redisStore = connectRedis(session);

// create server and connectivity to redis db
const port = process.env.PORT || 3001;
const redisClient = redis.createClient({host: "127.0.0.1", port: 6379});
const app = express();
//const router = express.Router();
// const imagesPath = path.join(__dirname, '/images');
const imagesPath = '/images';

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    store: new redisStore({client: redisClient}),
    secret: '123',
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30, // session max age in miliseconds
    }
}));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));


redisClient.on("connect", function () {
    console.log("You are now connected");
});

class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

const handleError = (err, res) => {
    const {statusCode, message} = err;
    res.setHeader('Content-Type', 'application/json');
    res.status(statusCode).json({
        status: "error",
        statusCode,
        message
    });
};

/** This Function is a Helper debugging function that print all users
 *  Base_Status: 100% complete.
 *  Status: 100% complete.
 */
app.get('/products', (req, res) => {
    const types = getAllTypeAsObj('products', (results) => {
        console.log(results);
    });
});


/** This Function is a Helper debugging function that print all users
 *  Base_Status: 100% complete.
 *  Status: 100% complete.
 */
app.get('/users', (req, res) => {
    const types = getAllTypeAsObj('users', (results) => {
        console.log(results);
    });

});

/** This async function is creating a user and inserting to db
 *  due to redis accessibility is a-Sync that means the entire func' must be a-sync
 *  Base_Status: 100% complete.
 *  Status: 90% complete.
 *  Problem right now
 *  1. Doesn't send the error to user.. (sends to console instead)
 *  2. Cookies for the next() functions
 *  3. Problem in Empty DB
 *  4. Encryprion
 */
app.post('/register', async (req, res, next) => {
        // error handling one of the values is undefined..
        if (req.session.key) {
            res.status(401).json("already logged in");
            return;
        }
        if (req.body.email.valueOf() === undefined || req.body.password.valueOf() === undefined || req.body.name.valueOf() === undefined) {
            res.status(400).json("Missing Data in the request");
            return;
        }
        // generate new id depending on the type of object in order in insert to first hash key
        let id = generateNewIDforObject("user");
        // check validity of email if is not valid. go to next, we want to wait here for data to return
        let emailVal = await checkValitdyEmail(req.body.email, req.body.remail);
        //error handling
        if (emailVal !== true) {
            if (emailVal === "Not the same") {
                res.status(401).json("Not the same email");
                return;
            }
            // email is taken
            if (emailVal === "Taken") {
                res.status(401).json("This Email is taken");
                return;
            }
            res.status(500).json("Unexpected Error");
            return;
        }
        //check validity of password if is not valid. go to next
        let passVal = checkValidityPass(req.body.password, req.body.rpassword);
        //error handling
        if (passVal !== true) {
            if (passVal === "illegal pass") {
                res.status(403).json(`this password is illegal, you must include at least
    - 1 digit (0-9)
    - 1 capital letter (A-Z)
    - 1 small letters (a-z)
    `);
                return;
            }
            if (passVal === "not same pass") {
                res.status(403).json("Not the same password");
                return;
            }
            res.status(500).json("Unexpected Error");
            return;
        }
        // creating a user
        let user = {
            id: id,
            password: req.body.password,// need encryption,
            name: req.body.name,
            email: req.body.email,
            logins: [], // contains date,hours in UTC, Local time
            purchases: [], //contains , purchase object that includes, items , prices, colors?, date, and after purchase clear cart
            cart: [],         // should be in cookies?
            sessions: [],   // list of all sessions
            cursession: false,
            permission_level: 2,// regular users
            //  falseEntry:0,
            // recq
            // reca
        };
        // set the user into db , hashed
        redisClient.hset('users', id, JSON.stringify(user), (err, results) => {
            if (err) console.log(err);
        });
        console.log("registration complete");
//        res.status(200).json("User registered Successfully");
        res.status(200).json(user);
    }
);

/**This function is for logging in the user and sets values in his session
 *  Base_Status: 100% complete.
 *  Status: 90% complete.
 *  Problems:
 * 1. password need to be hashed,Encryprion/Decryption
 * 2. cookies (for errors , dos attacks, and multiple enteries) in front
 * 3. personalized page (showing cart)-> redirection
 */
app.post('/login', async (req, res, next) => {
    // getting the parameter from the request
    if (req.session.key) {
        try {
            throw new ErrorHandler(401, 'Already logged in')
        } catch (err) {
            next(err)
        }
        //throw new ErrorHandler(401, 'already logged in')
        //res.status(401).send({error: "already logged in"});
        return;
    }
    let email = req.body.email;
    let pass = req.body.password;
    // Case handling the email or password is not given in HTTP req
    if (email.valueOf() === undefined || pass.valueOf() === undefined) {
        res.status(400).send("Missing Data");
        return;
    }
    // checking if there is a user with this email and the password matches
    let ans = (await checkEmailPassword(email, pass));
    // error handling
    if (ans !== true) {
        if (ans === "not registered") {
            res.status(401).send("Please Register or enter another mail");
            return;
        }
        if (ans === "Password Is Incorrect") {
            res.status(403).send("Wrong Password");
            return;
        }
        if (ans === "Missing Data") {
            res.status(400).json("Missing Data in the request");
            return;
        }
        res.status(500).json("Unexpected Error");
        return;
    }

    // finds the user which has the value of the email given as is value
    let user = (await whereSQLmain("users", "email", email).valueOf())[0];// user[0] -> since it returns in the let user line as an array with 1 value
    // give the current date in UTC.
    let date = new Date().toUTCString();
    // Pushes the last date in the logins array. and we want to wait for that
    let newLogins = await pushItemToObject(user, "logins", date);
    // We Update the DB accordingly
    await updateObjectIndb("users", user, "logins", newLogins);
    //   req.session.client_id = user[0].id;
    req.session.key = user.id;
    req.session.cart = user.cart;
    req.cookies.userid = user.id;
    req.session.cookie.userid = user.id;
    let newSessions = await pushItemToObject(user, "sessions", req.session.id);
    await updateObjectIndb("users", user, "sessions", newSessions);
    res.status(200).json(user);
    console.log("Log In Successfully");
});

app.get('/connected-user', async (req, res, next) => {
    if (!req.session.key) {
        try {
            throw new ErrorHandler(401, 'Not Logged In')
        } catch (err) {
            next(err)
        }
        //res.status(401).send({user: ''});
        return;
    }
    const user = (await whereSQLmain("users", "id", req.session.key)).valueOf()[0];
    res.status(200).send(user);
})


/** This Function is logout function, and destroys the session
 *  Base_Status: 100% complete.
 *  Status: 90% complete.
 */
app.post('/logout', function (req, res, next) {
    if (!req.session.key) {
        try {
            throw new ErrorHandler(401, 'Already Logged Out')
        } catch (err) {
            next(err)
        }
        return;
    } else {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.status(200).send({message: "Logged Out Successfully"});
            }
        });
    }
});


/**Temp method for main page
 * maybe change to redirection to the main store?
 */
app.get('/', (req, res) => {
    res.send("Hello");
});

/** This function is admin only function , and returns all the non admin users data exluding the password from db
 *  Base_Status: 90% complete.
 *  Status: 90% complete.
 */
//TODO test
app.post('/admin/users', async (req, res) => {
    console.log("Test");
    if (!req.session.key) {
        res.status(401).json("Please Login");
    }
    let user = (await whereSQLmain("users", "id", req.session.key)).valueOf()[0];
    if (user.permission_level >= 2) {
        res.status(401).json("Not Admin");
    }
    let users = (await whereSQLmain("users", "permission_level", 2)).valueOf();
    let usersSend = users.map((user) => {
        delete (user.password);
        return user;
    });
    console.log(usersSend);
    res.status(200).send(usersSend);
});

/** This function is admin only function , and adding a product to database
 *  Base_Status: 90% complete.
 *  Status: 90% complete.
 *  Problems :
 *
 */
// TODO test
app.post('/admin/addproduct', async (req, res) => {
    if (!req.session.key) {
        res.status(401).json("Need to login first");
        return;
    }
    let user = (await whereSQLmain("users", "id", req.session.key)).valueOf()[0];
    if (user.permission_level >= 2) {
        res.status(401).json("Not Authorized");
        return;
    }
    let id = generateNewIDforObject("product");
    let path1 = `${imagesPath}/${req.body.image}`;
    if (!path1) {
        //error
        res.status(500).send("Image not in folder");
        return;
    }
    if (Number(req.body.price) !== req.body.price && Number(req.body.price) <= 0) {
        //error
        res.status(500).send("Price is invalid");
        return;
    }
    let product = {
        id: id,
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        image: path1,
        color: req.body.color,// 6 digit hex
        price: req.body.price,
        rating: 0,
        usersVoted: [],
        sumratings: 0,
        numvote: 0
    };
    redisClient.hset('products', id, JSON.stringify(product), (err, results) => {
        if (err) console.log(err);
    });
});
/** This function is admin only function , and given a user in front page, it gives his purchases history
 *  Base_Status: 90% complete.
 *  Status: 90% complete.
 *  Problems :
 *
 */
// TODO test
app.post('/admin/purchases', async (req, res) => {
    if (!req.session.key) {
        res.status(401).json("Need to login first");
        return;
    }
    let user = (await whereSQLmain("users", "id", req.session.key)).valueOf()[0];
    if (user.permission_level >= 2) {
        res.status(401).json("Not Authorized");
        return;
    }
    let wanteduser = (await whereSQLmain("users", "id", req.body.user)).valueOf()[0];
    if (!wanteduser) {
        res.status(500).json("Not a user");
        return;
    }
    res.status(200).json(wanteduser.purchases);
});

/** This function is admin only function , and its edit a product that exists in the database by giving it's id
 *  Base_Status: 90% complete.
 *  Status: 90% complete.
 *  Problems :
 *
 */
// TODO test
app.post('/admin/editproduct', async (req, res) => {
    if (!req.session.key) {
        res.status(401).json("Need to login first");
        return;
    }
    let user = (await whereSQLmain("users", "id", req.session.key)).valueOf()[0];
    if (user.permission_level >= 2) {
        res.status(401).json("Not Authorized");
        return;
    }
    let product = (await whereSQLmain("products", "id", req.body.product)).valueOf()[0];
    if (!product) {
        res.status(401).json("Not in the database");
    }
    let field = req.body.field;
    if (field === "id") {
        res.status(500).send("Error");
        return;
    }
    let newValue = req.body.newValue;
    if (field === "price") {
        if (Number(newValue) !== newValue && Number(newValue) <= 0) {
            //error
            res.status(500).send("Price is invalid");
            return;
        }
    }
    if (field === "image") {
        newValue = `${imagesPath}/${req.body.image}`;
        if (!newValue) {
            //error
            res.status(500).send("Image not in folder");
            return;
        }
    }

    await updateObjectIndb("products", product, field, newValue);
});
/** This function is admin only function , and adding a product to database
 *  Base_Status: 90% complete.
 *  Status: 90% complete.
 *  Problems :
 *
 */
// TODO test
app.post('/admin/sessions', async (req, res) => {
    if (!req.session.key) {
        res.status(401).json("Need to login first");
        return;
    }
    let user = (await whereSQLmain("users", "id", req.session.key)).valueOf()[0];
    if (user.permission_level >= 2) {
        res.status(401).json("Not Authorized");
        return;
    }
    let wanteduser = (await whereSQLmain("users", "id", req.body.user)).valueOf()[0];
    if (!wanteduser) {
        res.status(500).json("Not a user");
        return;
    }
    res.status(200).json(wanteduser.sessions);
});


/** This function allows you to get a product
 *
 */
app.post('/products/:product', async (req, res) => {
    if (!req.session.key) {
        res.status(401).json("Please Login");
        return;
    }
    let prodID = req.params.product;
    let product = (await whereSQLmain("products", "id", prodID)).valueOf()[0];
    if(!product){
        res.status(500).json("Error");
    }
    res.status(200).send(product);
});

/** This function allows to add a product from the store to the cart
 *  @param product = (req.params.product), is the product id given
 *  Base_Status: 100% complete.
 *  Status: 100% complete.
 */
//let id = req.session.key; // create var name
app.post('/products/:product/addtocart', async (req, res) => {
    if (!req.session.id) {
        res.status(401).json("Please Login");
        return;
    }
    let user = (await whereSQLmain("users", "id", req.session.key)).valueOf()[0];
    let prodID = req.params.product;
    let product = (await whereSQLmain("products", "id", prodID)).valueOf()[0];
    if (!product) {
        res.status(401).send("error");
        return;
    }
    let cart = user.cart;
    let index = await findProductInCart(cart, product.id);
    let result;
    let message;
    let newCart;
    if (index !== -1) {
        // exist in cart
        result = cart[index];
        result.quantity += 1;
        cart[index] = result;
        newCart = cart;
        message = "The Item's quantity increases by 1";
    } else {
        //let quantity = 1||req.params.quantity; /:quantity
        result = {product: product, quantity: 1};//quantity:quantity
        message = "Item was successfully added to cart";
        newCart = await pushItemToObject(user, "cart", result);
    }
    await updateObjectIndb("users", user, "cart", newCart);
    req.session.cart = newCart;
    //res.status(200).send(message);
    res.status(200).send(newCart);
});
/** This function allows to raise the quantity of a product that already is the cart by 1
 *  @param product = (req.params.product), is the product id given
 *  Base_Status: 100% complete.
 *  Status: 100% complete.
 */
app.post('/cart/:product/addone', async (req, res, next) => {
    //add items to cart..
    if (!req.session.key) {
        res.status(401).json("Please Login");
        return;
    }
    let user = (await whereSQLmain("users", "id", req.session.key)).valueOf()[0];
    let cart = req.session.cart.valueOf();
    let index = await findProductInCart(cart, req.params.product);
    if (index === -1) {
        //ERROR CONTROL
        res.status(400).json("Unauthorized");
        return;
    }
    let result = cart[index];
    result.quantity += 1;
    cart[index] = result;
    let newCart = cart;
    let message = "Item's quantity is does increase by 1";
    //let newCart = await pushItemToObject(user, "cart", result);
    await updateObjectIndb("users", user, "cart", newCart);
    req.session.cart = newCart;
    res.status(200).send(newCart);
    //res.status(200).send(message);
});

/** This function allows to decrease the quantity of a product that already is the cart by 1
 *  @param product = (req.params.product), is the product id given
 *  Base_Status: 100% complete.
 *  Status: 100% complete.
 */
app.post('/cart/:product/removeone', async (req, res) => {
    // remove 1 items from cart..
    // if quantity == 1 => removeall
    // TOLEARN : redirect + cookies
    if (!req.session.key) {
        res.status(401).json("Please Login");
        return;
    }
    let user = (await whereSQLmain("users", "id", req.session.key)).valueOf()[0];
    let cart = req.session.cart.valueOf();
    let product = (await whereSQLmain("products", "id", req.params.product)).valueOf()[0];
    let index = await findProductInCart(cart, req.params.product);
    if (index === -1) {
        //Quan = 0 , item not in cart
        res.status(500).json("Not in cart");
        return;
    }
    let message;
    let result;
    if (cart[index].quantity <= 0) {
        // unexpected error
        res.status(500).json("Unexpected Error");
        return;
    }
    if (cart[index].quantity === 1) {
        result = await removeItemFromCart(cart, req.params.product);
        message = `Since only one ${product.name} was in cart it was removed`;
    } else {
        // remove 1
        result = await updateQuantityInCart(cart, index, -1);
        message = "Item's quantity is does decreased by 1";
    }
    await updateObjectIndb("users", user, "cart", result);
    req.session.cart = result;
    res.status(200).json(req.session.cart)
    //res.status(200).send(message);
});
/** This function allows to drop a cart item that already is the cart from the cart
 *  @param product = (req.params.product), is the product id given
 *  Base_Status: 100% complete.
 *  Status: 100% complete.
 */
app.post('/cart/:product/removeallProduct', async (req, res) => {
    if (!req.session.key) {
        res.status(401).json("Please Login");
        return;
    }
    let user = (await whereSQLmain("users", "id", req.session.key)).valueOf()[0];
    let cart = req.session.cart.valueOf();
    let index = await findProductInCart(cart, req.params.product);
    if (index === -1) {
        //Quan = 0 , item not in cart
        res.status(500).json("Not in cart");
        return;
    }
    let newCart = await removeItemFromCart(cart, req.params.product);
    await updateObjectIndb("users", user, "cart", newCart);
    req.session.cart = newCart;
    res.status(200).json(req.session.cart)
    // res.status(200).send("Item Was Successfully removed");
});
/** This function allows to delete all the products in the cart
 *  @param product = (req.params.product), is the product id given
 *  Base_Status: 100% complete.
 *  Status: 100% complete.
 */
app.post('/cart/emptycart', async (req, res) => {
    if (!req.session.key) {
        res.status(401).json("Please Login");
        return;
    }
    let user = (await whereSQLmain("users", "id", req.session.key)).valueOf()[0];
    req.session.cart = [];
    await updateObjectIndb("users", user, "cart", []);
    res.status(200).send("Cart was successfully emptied");
});
/** This function peforms a "checkout"
 *  the process includes
 *  A) Check validity from front
 *  B) Add new Purchase to user purchases
 *  C) Clean the cart
 *  @param price = (req.params.price), is the total price given by the
 *  Base_Status: 100% complete.
 *  Status: 100% complete.
 */

app.post('/checkout/:price', async (req, res) => {
    if (!req.session.key) {
        res.status(401).json("Please Login");
        return;
    }
    let user = (await whereSQLmain("users", "id", req.session.key)).valueOf()[0];
    let userInfo = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNum: req.body.phoneNum,
        country: req.body.country,
        address: req.body.address,
        zipCode: req.body.zipCode
    };
    let cart = req.session.cart;
    let result = await quancheck(cart);
    if (result === "NOPE") {
        // ERROR with quantities
        res.status(500).json("Some went wrong with quantities");
        return;
    }
    let pricecheck = await priceCheck(cart);
    if (pricecheck === 0) {
        //error empty cart
        res.status(400).json("Cannot checkout empty car");
        return;
    }
    if (pricecheck !== Number(req.params.price)) {
        res.status(500).json("Error with Prices");
        return;
    }
    //ok
    let date = new Date().toUTCString();
    let purchaseObj = {cart: cart, price: pricecheck, date: date, userInfo: userInfo};
    let newPurchases = await pushItemToObject(user, "purchases", purchaseObj);
    await updateObjectIndb("users", user, "purchases", newPurchases);
    await updateObjectIndb("users", user, "cart", []);
    req.session.cart = [];
    // res.status(200).json(req.session.cart)
    res.send(200).json("Purchase complete, You can look in your personal purchases to see it. Thank you for buying at Flint\n" +
        "the place to ignite your camping adventure");
});
/** This function handles the search user by name feature in admin
 *  Base_Status: ?% complete.
 *  Status: ?% complete.
 */
// TODO Test
app.post('search/searchproduct', async (req, res) => {
    if (!req.session.key) {
        res.status(401).json("Need to login first");
        return;
    }
    let productsFind = (await whereSQLmain("users", "name", req.body.query)).valueOf();
    if(!productsFind){
        res.status(401).json("Error");
    }
    res.send(200).json(productsFind);
});
/** This function handles the search user by name feature in admin
 *  Base_Status: 100% complete.
 *  Status: 100% complete.
 */
//TODO test
app.post('admin/search/searchuser', async (req, res) => {
    if (!req.session.key) {
        res.status(401).json("Need to login first");
        return;
    }
    let user = (await whereSQLmain("users", "id", req.session.key)).valueOf()[0];
    if (user.permission_level >= 2) {
        res.status(401).json("Not Authorized");
        return;
    }
    let usersFind = (await whereSQLmain("users", "name", req.body.query)).valueOf();
    res.send(200).json(usersFind);
});
/** This function filters the products shown via category
 *  @param category = (req.params.category), is the product id given
 *  Base_Status: 100% complete.
 *  Status: 100% complete.
 */
app.get('/categories/:category', async (req, res) => {
    // if category === "general" ->all
    let category = req.params.category;
    let afterFilter;
    if (category === undefined) {
        afterFilter = await getallType("products");
    } else {
        afterFilter = await whereSQLmain("products", "category", category);
    }
    res.status(200).json(afterFilter);
});

/** This function the user to show the purchases activities
 *  Base_Status: 100% complete.
 *  Status: 100% complete.
 */
// TODO test
app.post('/purchases', async (req, res) => {
    // maybe send to this user?
    if (!req.session.key) {
        res.status(401).json("Please Login");
        return;
    }
    let user = (await whereSQLmain("users", "id", req.session.key)).valueOf()[0];
    res.status(200).json(user.purchases);
});
/** This function allows the admin to show the purchases activities
 *  Base_Status: 90% complete.
 *  Status: 90% complete.
 *  1. how to look up a specific user
 */
// TODO test
app.post('admin/:user/purchases', async (req, res) => {
    // maybe send to this user?
    if (!req.session.key) {
        res.status(401).json("Please Login");
        return;
    }
    let user = (await whereSQLmain("users", "id", req.session.key)).valueOf()[0];
    if (user.permission_level >= 2) {
        res.status(403).json("Not Admin");
    }
    // not admin => error
    let userWanted = (await whereSQLmain("users", "name", req.params.user)).valueOf()[0];
    if(!userWanted){
        res.status(500).json("User not found");
    }
    res.status(200).json(userWanted.purchases);
});


/** updating the rating
 *
 * @param product - the product given a rating
 * @param rating - the new rating given by user
 *  Base_Status: 100% complete.
 *  Status: 100% complete.
 * problem : need to lock somehow the user from double voting, bought item in past, only if logged in ..
 */
// TODO test
app.post('products/:product/rating/:rating', async (req, res) => {
    // if not logged in -> error
    if (!req.session.key) {
        res.status(401).json("Please Login");
        return;
    }
    // EXTRA if not purchased and past 14 days -> error please try and enjoy the product before give it a review
    let user = (await whereSQLmain("users", "id", req.session.key)).valueOf()[0];
    let rating = Number(req.params.rating);
    let validRating = [1, 2, 3, 4, 5].filter(i => i === rating).length;
    if (validRating !== 1) {
        //error
        res.status(500).json("Somthing went wrong");
        return;
    }
    let product = (await whereSQLmain("products", "id", req.params.product)).valueOf()[0];
    let map = (await product.usersVoted.map(obj => obj.id));
    let index = (await map.indexOf(user.id));
    if (index <= -2) {
        res.status(500).json("Somthing went wrong");
        return;
    }
    let newrating;
    let newsumratings;
    let newUserVoted;
    let newNumVoted;
    if (index === -1) {
        // if not voted case A -> get new vote + calculate the rating average
        newNumVoted = product.numvote + 1;
        newUserVoted = await pushItemToObject(product, "usersVoted", {id: user.id, rating: rating});
        newsumratings = product.sumratings + rating;
        newrating = newsumratings / newNumVoted;
    } else {
        // if voted case B -> get old rating from product voted param and req.session.key, calc(newrating-oldrating)
        //                    + calculate the difference
        newNumVoted = product.numvote;
        let alterRating = rating - product.usersVoted[index].rating;
        let newUserVoted = product.usersVoted;
        newUserVoted[index].rating = rating;
        newsumratings = product.sumratings + alterRating;
        newrating = newsumratings / newNumVoted;
    }
    await updateObjectIndb("products", product, "numvote", newNumVoted);
    await updateObjectIndb("products", product, "usersVoted", newUserVoted);
    await updateObjectIndb("products", product, "sumratings", newsumratings);
    await updateObjectIndb("products", product, "rating", newrating);



});
/** this function generate new key for user and products
 *  if we run into an old key it regenerate
 *
 * @param type - user \ product
 * @return {string|null}
 *  Base_Status: 100% complete.
 *  Status: 95% complete
 */
function generateNewIDforObject(type) {
    //promise
    let newID = shortid.generate();
    if (type === "user" || type === "product") {
        newID = type + "_" + newID;
        // TODO edit to new DB usage
        while (!redisClient.exists(type + 's', newID)) {
            newID = type + "_" + shortid.generate();
        }
        return newID;
    } else {
        return null;
    }
}

/**
 * this function retrieves all the data of a certain field of a certain type
 * example, all the emails of users, all the prices of product.
 * the main part written here gets all the types form db, the call back transform them
 * @param type = can be user\product; otherwise null
 * @param field = a respective field of the type
 * @param callback = a callback function used to do operation on the data
 * @return  {null|*[]} =a mapped array of all param wanted
 *  Base_Status: 100% complete.
 *  Status: 100% complete
 **/

const getAllFieldsByType = (type, field, callback) => {
    return redisClient.hgetall(type, (err, results) => {
        if (err) console.log(err);
        else callback(getValuesByField(results, field));
        //else console.log(getValuesByField(results, field));
    });
    // user_key + JSON(object) -> dictionary
};

/** This is a helper function that gets all the types, as key+ value(JSON) and transforms them into
 * an array of the field (all the emails).
 * @param items - the result from getvaluesbyfield
 * @param field - the wanted field
 * @return {*[]} - the array wanted
 *  Base_Status: 100% complete.
 *  Status: 100% complete
 */
const getValuesByField = (items, field) => {
    const allValues = Object.values(items).map(i => JSON.parse(i));//object of objects key+value ->array of objects values(JSON) -> array of values(OBJ)
    return allValues.map(v => v[field]);//array obj->array of obj.field
};

/**
 * this function retrieves all the data of a certain field of a certain type
 * example, all the emails and passwords of users, all the prices and categories of product.
 * the main part written here gets all the types form db, the call back transform them
 * @param type = can be user\product; otherwise null
 * @param field1 = a respective field of the type
 * @param field2 = a respective field of the type
 * @param callback = a callback function used to do operation on the data
 * @return  {string|*[]} =a mapped array of all params wanted
 *  Base_Status: 100% complete.
 *  Status: 100% complete
 **/

const getAllFieldsByType1 = (type, field1, field2, callback) => {
    // error handle
    if (field2 === field1) {
        return "same type were chosen";
    }
    // get all type from redis
    return redisClient.hgetall(type, (err, results) => {
        if (err) console.log(err);
        else callback(getValuesByField1(results, field1, field2));// transforms into array [field1,field2]
    });
};


/** This is a helper function that gets all the types, as key+ value(JSON) and transforms them into
 * an array of the field (all the emails).
 * @param items - the result from getvaluesbyfield
 * @param field1 - the wanted field
 * @param field2 - the second wanted field
 * @return {*[]} - the array wanted
 *  Base_Status: 100% complete.
 *  Status: 100% complete
 */
const getValuesByField1 = (items, field1, field2) => {
    const allValues = Object.values(items).map(i => JSON.parse(i));// obj of obj key+value(both string) ->array of values(JSON) ->array of values(OBJ)
    return allValues.map(v => [v[field1], v[field2]]);// arr of obj->arr of [obj.field1, obj.field2]
};

/** this function retrieves all of a certain type from db ,
 *  in order to transform the into object
 * @param type - user\product
 * @param callback - the callback function
 * @return {*} - the answer array
 *  Base_Status: 100% complete.
 *  Status: 100% complete
 */

const getAllTypeAsObj = (type, callback) => {
    // get all type from redis
    return redisClient.hgetall(type, (err, results) => {
        // results is built as user_key + JSON(object)
        if (err) console.log(err);
        else callback(getallType(results));// tranform into array of objects
    });
};

/** this function transforms all the type from key+value(JSON) into an array of objects according to the type chosen
 *
 * @param items- the result from last function
 * @return {any[]} - the array of objects
 * Base_Status: 100% complete.
 * Status: 100% complete
 */
const getallType = (items) => {
    if (items === undefined || items === null) return items;
    return Object.values(items).map(i => JSON.parse(i));// object of object (key+value) -> array of objects values(JSON) -> array of objects values(OBJ)
};


/** this function is a redis+js way to handle a request that can be handled via where in SQL
 *  here the get from DB happens .
 *  uses: category + product , updating logins, purchases and more
 * @param type - user\product
 * @param field - the field wanted
 * @param value - the value asked
 * @param callback - the callback function
 * @return {*} - an array of results
 * Base_Status: 100% complete.
 * Status: 100% complete
 */
const whereSQL = (type, field, value, callback) => {
    // get all type from redis
    return redisClient.hgetall(type, (err, results) => {
        // results is built as user_key + JSON(object)
        if (err) console.log(err);
        else callback(whereSQL1(results, field, value));// filter accordingly returns as array
    });
};
/** this helper function does the translation and filtering according to the values
 *
 * @param items- the result from ealier
 * @param field - the field wanted
 * @param value - the values wanted
 * @return {any[]} - array of results
 * Base_Status: 100% complete.
 * Status: 100% complete
 */
const whereSQL1 = (items, field, value) => {
    const values = Object.values(items).map(i => JSON.parse(i));// key+value -> values(JSON) -> values(OBJ)
    return values.filter(obj => obj[field] === value);//array of obj=> array of obj filtered
};


/** this function is the main function we want to call . since the redis is async call
 *  I want to resolve and find the result before going on next .
 * @param type - users\products
 * @param field - the field wanted
 * @param value - the value searched
 * @return {Promise<unknown>} - the result wanted as Array
 * Base_Status: 100% complete.
 * Status: 100% complete
 */
function whereSQLmain(type, field, value) {
    return new Promise((resolve) => {
        whereSQL(type, field, value, (results) => {
            if (results === null) {
                resolve(null);
                return;
            }
            resolve(results);
        })
    })
}

/** Checks if the email and password entered are in db and match accordingly
 *
 * @param email - email form login
 * @param password - password entered
 * @return {string|boolean} - > String|false is error, true is OK
 * Base_Status: 100% complete.
 * Status: 90% complete
 * 1.timeout after 3 logins
 */

async function checkEmailPassword(email, password) {
    return await new Promise(async (resolve) => {
        getAllFieldsByType1("users", "email", "password", async (results) => {
            let emailarr = results.map(i => i[0]);//i => 2D array , each row [email,pass]
            let index = emailarr.indexOf(email);// search for value of email in email array
            if (index === -1) {
                // if cannot found => not in DB => not registered
                resolve("not registered");
                return;
            }
            // console.log(results[index][1]);
            // console.log(genhash(password));
//validPass(results[index][1], password)

            if (results[index][1] === password) {
                // the respected password is correct
                resolve(true);
            } else {
                // the respected password is incorrect
                resolve("Password Is Incorrect");
            }
        });
    })
}

/** Checks if there is email in db and the two mails that were entered are valid
 *
 * @param email - email form HTTP
 * @param remail - remail from HTTP
 * @return {string|boolean} - string -> error, true-> OK
 * Base_Status: 100% complete.
 * Status: 100% complete
 */

function checkValitdyEmail(email, remail) {
    if (email !== remail) {
        return "Not the same";
    }
    return new Promise(resolve => {
        // gets all emails
        getAllFieldsByType("users", "email", (results) => {
            // if not found -> can be registered on new account.
            if (results.indexOf(email) === -1) {
                resolve(true);
            } else {
                //if found-> this mail is taken ..
                resolve("Taken");
            }
        });
    })
}

/** Checks if the password given is valid and the two password are identical
 *  this function also built at Front here to check unexpected error
 * @param passA - the first password
 * @param passB - the second password
 * @return {string|boolean} - string -> error, true-> OK
 * Base_Status: 100% complete.
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

/** This function takes an obejct that holds an array in the field chosen and
 *  add the value later
 *  usege-> add last login.
 * @param object - the object wanted
 * @param field - the field wanted
 * @param value - the value to push
 * @return {Promise<unknown>} - the new value of the field.
 * Base_Status: 100% complete.
 * Status: 100% complete
 */
function pushItemToObject(object, field, value) {
    return new Promise(resolve => {
        object[field].push(value);
        let newField = object[field];
        resolve(newField);
    })
}


/** This async Func' takes an object and set the value back to redis to save the data
 *  after update
 * @param type - users\products
 * @param object - the user\product wanted
 * @param field - the field that we want to change
 * @param newValue - the value after change
 * @return {Promise<string>}- > just a message for debug purpose.
 * Base_Status: 100% complete.
 * Status: 100% complete
 */
async function updateObjectIndb(type, object, field, newValue) {
    object[field] = newValue;
    await redisClient.hset(type, object.id, JSON.stringify(object), (err, results) => {
        if (err) console.log(err);
    });
    return "OK";
}


/** This function handles the cart , and searches if a product is in the cart using its product id
 * if (returns -1) , not found otherwise returns the index
 * @param cart - the cart (already being identified to a user)
 * @param productID - the product id
 * @return {number} - the index
 */

function findProductInCart(cart, productID) {
    let newCart = cart.map(obj => obj.product.id);
    return newCart.indexOf(productID);
}

/** This fuction handles te cart, and removes the item according to the product object given
 *  and returns the array without the item
 * @param cart - the cart (already being identified to a user)
 * @param productID - the product's ID
 * @return {Promise<unknown>}
 */
function removeItemFromCart(cart, productID) {
    let array = cart.filter(obj => obj.product.id !== productID);
    console.log(array.length);
    return new Promise((resolve) => {
        resolve(array);
    });
}

/** this function handles the cart , and updates the quantity accordingly
 *  if decreased too much it will be removed
 * @param cart - the cart (already being identified to a user)
 * @param index -  the product's index in cart
 * @param value - the quantities added/decreased
 * @return {Promise<unknown>}
 */
function updateQuantityInCart(cart, index, value) {
    let temp = value * (-1);
    if (temp >= cart[index].quantity && temp >= 0) {
        return removeItemFromCart(cart, cart[index].product);
    }
    return new Promise((resolve) => {
        let newCart = cart;
        console.log(cart);
        newCart[index].quantity += value;
        console.log(newCart);
        console.log(newCart[index]);
        resolve(newCart);
    });
}

/** This function handles the cart in checkout operarion
 *  and check that every quantity is vaild (strictly positive)
 * @param cart - the cart (already being identified to a user)
 * @return {Promise<unknown>}
 */
function quancheck(cart) {
    return new Promise(resolve => {
        let len = cart.length;
        let after_check_cart = cart.filter(obj => obj.quantity >= 1);//0| neg
        let len2 = after_check_cart.length;
        if (len === len2) {
            resolve("OK");
        } else {
            resolve("NOPE");
        }
    });
}

/** This function handles the cart in checkout operarion
 *  this is a validation function to the price calculated in the front end
 * @param cart
 * @return {Promise<unknown>}
 */
// cart item {product: Product(object) ,quantity: strictly positive number }
function priceCheck(cart) {
    return new Promise((resolve) => {
        let priceandquan = cart.map(obj => [obj.product.price, obj.quantity]);// 2dARR
        let calc = priceandquan.map(arr => arr[0] * arr[1]);// price*quantity
        resolve(calc.reduce((sum, cur) => sum + cur, 0));
    });
}


/** This function is helping initing the database
 * if it's not and return a boolean
 * it's waiting for the result from isFirstInit
 * @return {Promise<boolean>}= if the db is empty
 */
async function firstInitAssign() {
    return await isFirstInit();
}

/** This function is helping initing the database
 * if it's not and return a boolean
 *
 * @return {Promise<boolean>}= if the db is empty
 */

function isFirstInit() {
    return new Promise((resolve => {
        getAllTypeAsObj('users', (results) => {
            resolve(results === null);
        });
    }));
}

/** this function helps initing the db by setting products
 *
 * @param object - the product
 * @return {boolean}
 */
//debug
function addProductInit(object) {
    if (!firstInitAssign()) {
        return false;
    }
    let id = generateNewIDforObject("product");
    let path1 = `${imagesPath}/${object.image}`;
    if (!path1) {
        return;
    }
    if (Number(object.price) !== object.price && Number(object.price) <= 0) {
        //error
        return;
    }
    let product = {
        id: id,
        name: object.name,
        description: object.description,
        category: object.category,
        image: path1,//jpeg,png file path to cloud ??
        color: object.color,// 6 digit hex
        price: object.price,
        rating: 0,
        usersVoted: [],
        sumratings: 0,
        numvote: 0,
    };
    redisClient.hset('products', id, JSON.stringify(product), (err, results) => {
        if (err) console.log(err);
    });
}

/** This function is helping initing the database
 * and add admin and few products to db
 *
 * @return {Promise<>}
 */
async function setBaseDB() {
    if (!await firstInitAssign()) {
        return false;
    }
    let data = {
        name: "Air Mattress",
        description: "This is an air mattress. After using an air pump you can go an sleep on it",
        category: "camping_accessories",
        image: "Air Mattress.png",
        color: "Black",
        price: 50,
    };
    addProductInit(data);
    data = {
        name: "Backpack",
        description: "This is a backpack. This backpack has a bottle carrier an 2 storage unit",
        category: "storage",
        image: "Backpack.png",
        color: "Red",
        price: 30,
    };
    addProductInit(data);
    data = {
        name: "Blanket",
        description: "This is a blanket to cover your self up while sleeping cold night",
        category: "camping_accessories",
        image: "Blanket.png",
        color: "Light Blue",
        price: 25,
    };
    addProductInit(data);
    data = {
        name: "Bottles",
        description: "This is an Bottle Set. 4 bottles, and pouring related products",
        category: "culinary",
        image: "Bottles.png",
        color: "Black",
        price: 50,
    };
    addProductInit(data);
    data = {
        name: "Carpet",
        description: "A soft carpet suitable for sitting and relaxation",
        category: "camping_accessories",
        image: "Carpet.png",
        color: "Pink",
        price: 80,
    };
    data = {
        name: "Womens Coat",
        description: "Warm and lite coat, water resistance, double sided blue & orange",
        category: "clothing",
        image: "Womens Coat.png",
        color: "blue",
        price: 150,
    };
    addProductInit(data);
    data = {
        name: "Fleece Women",
        description: "Warm and soft fleece",
        category: "clothing",
        image: "Fleece Women.png",
        color: "Gray",
        price: 120,
    };
    addProductInit(data);
    data = {
        name: "Wool Hat",
        description: "Merino wool hat. Warm and very soft",
        category: "clothing",
        image: "Wool Hat.png",
        color: "white",
        price: 100,

    };
    addProductInit(data);
    data = {
        name: "Jacket",
        description: "Warm, water resistance men’s coat",
        category: "clothing",
        image: "Jacket.png",
        color: "Dark Gray",
        price: 200,

    };
    addProductInit(data);
    data = {
        name: "Head Flashlight",
        description: "24 hours battery Soft straps",
        category: "camping_accessories",
        image: "Head Flashlight.png",
        color: "Black",
        price: 80,
    };
    addProductInit(data);
    data = {
        name: "Shade Canopy",
        description: "Strong shade canopy with sun screen. Suitable for 4 people",
        category: "camping_accessories",
        image: "Shade Canopy.png",
        color: "silver",
        price: 250,
    };
    addProductInit(data);
    data = {
        name: "Picnic Cooler",
        description: "Soft picnic cooler. 32 liters",
        category: "storage",
        image: "Picnic Cooler.png",
        color: "Blue",
        price: 150,
    };
    addProductInit(data);
    data = {
        name: "Neck Warmer",
        description: "warms the neck in cold weather",
        category: "camping_accessories",
        image: "Neck Warmer.png",
        color: "blue",
        price: 80,
    };
    addProductInit(data);
    data = {
        name: "Neck Pillow",
        description: "Good support for head and neck during travel",
        category: "camping_accessories",
        image: "Neck Pillow.png",
        color: "Yellow",
        price: 80,
    };
    addProductInit(data);
    data = {
        name: "Lock Passcode",
        description: "Lock with passcode",
        category: "camping_accessories",
        image: "Lock Passcode.png",
        color: "blue",
        price: 60,
    };
    addProductInit(data);
    data = {
        name: "Lock Keys",
        description: "Lock with keys",
        category: "camping_accessories",
        image: "Lock keys.png",
        color: "Orange",
        price: 60,
    };
    addProductInit(data);
    data = {
        name: "Name Tag",
        description: "Name tags. Suitable for bags and suitcases",
        category: "camping_accessories",
        image: "Name Tag.png",
        color: "Green",
        price: 25,
    };
    addProductInit(data);
    data = {
        name: "Folding Bag",
        description: " Easy to fold bag. Allows extra storage when needed",
        category: "camping_accessories",
        image: "Folding Bag.png",
        color: "Black",
        price: 100,
    };
    addProductInit(data);
    data = {
        name: "Folding Chair",
        description: "Easy to fold chair. Vert light weight",
        category: "camping_accessories",
        image: "Folding Chair.png",
        color: "Black",
    };
    addProductInit(data);
    //let p = setTimeout( encrypt("1234Ac"),400);


    let adminId = "user_admin";
    let admin = {
        id: adminId,
        email: "taldanai@icloud.com",
        name: "Tal Danai",
        password: "1234Ac",//p genhash("1234Ac")
        logins: [], // contains date,hours in UTC, Local time
        purchases: [], //contains , purchase object that includes, items , prices, colors?, date, and after purchase clear cart
        cart: [],         // should be in cookies?
        sessions: [],   // list of all sessions
        permission_level: 1,//Admin
    };
    redisClient.hset("users", adminId, JSON.stringify(admin), (err, results) => {
        if (err) console.log(err);
    });

}

// function genhash(text) {
//     return bcrypt.hashSync(text, bcrypt.genSaltSync(9));
// }
//
// function validPass(text, pass) {
//     console.log(bcrypt.compareSync(text, pass));
//     return bcrypt.compareSync(text, pass);
// }

setBaseDB();

app.use((err, req, res, next) => {
    handleError(err, res);
});

// Server listening
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});