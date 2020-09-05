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


const redisStore = connectRedis(session);
//const rootForImg = "https://drive.google.com/drive/folders/1BFgC9-v2w_eBIXmXUTrL3gmo0Y-39IW_?usp=sharing";

// create server and connectivity to redis db
const port = 3001;
const redisClient = redis.createClient({host: "127.0.0.1", port: 6379});
const app = express();
//const router = express.Router();
const imagesPath = path.join(__dirname, '/images');

app.use(cors());
app.use(bodyParse.json());
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
redisClient.on("connect", function () {
    console.log("You are now connected");
});
let adminId = "user_admin";
let admin = {
    id: adminId,
    email: "taldanai@icloud.com",
    name: "Tal Danai",
    password: "1234Ac",
    logins: [], // contains date,hours in UTC, Local time
    purchases: [], //contains , purchase object that includes, items , prices, colors?, date, and after purchase clear cart
    cart: [],         // should be in cookies?
    sessions: [],   // list of all sessions
    cursession: false,
    permission_level: 1,//Admin
};
redisClient.hset("users", adminId, JSON.stringify(admin), (err, results) => {
    if (err) console.log(err);
});


/** This async function is creating a user and inserting to db
 *  due to redis accessibility is a-Sync that means the entire func' must be a-sync
 *  Base_Status: 100% complete.
 *  Status: 90% complete.
 *  Problem right now
 *  1. doesn't send the error to user.. (sends to console instead)
 *  2. Cookies for the next() functions
 *  3. add next for user parameters not entered..
 *  4. Problem in Empty DB
 */
app.post('/register', async (req, res, next) => {
        // error handling one of the values is undefined..
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
//        return res.status().
        res.status(200).json("User registered Successfully");
    }
);


/** This Function is a Helper debugging function that print all users
 *  Base_Status: 100% complete.
 *  Status: 100% complete.
 */
app.get('/users', (req, res) => {
    // console.log(checkValitdyEmail("example@example.com", "example@example.com"));
    const types = getAllTypeAsObj('users', (results) => {
        console.log(results);
    });


});
/**This function is for forgot my password
 *  Base_Status: 100% complete.
 *  Status: 90% complete.
 *  reason : need to understand about get a key form value in db
 */
app.post('/forgotmypassword', (req, res) => {

});
/**This function is for forgot my password
 * Base_Status: 100% complete.
 * Status: 90% complete.
 * reason : need to understand few mechanics
 * cookies, authentication, how page is bulit.
 */
app.post('/resetpassword', (req, res) => {

});
/**This function is for logging in the user
 *  Base_Status: 100% complete.
 *  Status: 90% complete.
 *  Problems:
 * 1. password need to be hashed
 * 2. cookies (for errors , dos attacks, and multiple enteries)
 * 3. personalized page (showing cart)-> redirection
 */
app.post('/login', async (req, res, next) => {
    // getting the parameter from the request
    let email = req.body.email;
    let pass = req.body.password;
    // Case handling the email or password is not given in HTTP req
    if (email.valueOf() === undefined || pass.valueOf() === undefined) {
        next("Missing Data");
        return;
    }
    // checking if there is a user with this email and the password matches
    let ans = await checkEmailPassword(email, pass);
    // error handling
    if (ans !== true) {
        if (ans === "not registered") {
            res.status(401).send("Please Register or enter another mail");
            return;
        }
        if (ans === "Password Is Incorrect") {
            // console.log(1);
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
    let user = await whereSQLmain("users", "email", email).valueOf();
    // give the current date in UTC.
    let date = new Date().toUTCString();
    // TODO : COOKIE here + IF (LAST LOGIN - Current login<30 minute , login and renew cookie)

    if (!req.session.key) {
        // Pushes the last date in the logins array. and we want to wait for that
        let newLogins = await pushItemToObject(user[0], "logins", date); // user[0] -> since it returns in the let user line as an array with 1 value
        // We Update the DB accordingly
        await updateObjectIndb("users", user[0], "logins", newLogins);
        //   req.session.client_id = user[0].id;
        req.session.key = user[0].id;
        let newSessions = await pushItemToObject(user[0], "sessions", req.session.id); // user[0] -> since it returns in the let user line as an array with 1 value
        await updateObjectIndb("users", user[0], "sessions", newSessions);
        res.status(200).json("You are logged in");
        console.log("Log In Successfully");

    } else {
        res.status(200).json("Already logged in");
    }
});
/**
 * *  YET TO B TESTED
 */
app.get('/login', (req, res) => {
    res.send("Welcome User");

});
/***  YET TO B TESTED
 *
 */
app.get('/:id', async (req, res) => {
    let user = await ((await whereSQLmain("users", "id", req.params.id)).valueOf()[0]);
    if (/*user has session*/ !req.session.key) {
        res.redirect("/login");
    } else {
        // console.log(user.sessions);
        // console.log(req.session.key);
        res.send(`Welcome ${user.name}`);
    }
});
//TODO API
/**
 * *  YET TO B TESTED
 */
app.post(':id/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("localhost:3001/");//
        }
    });
});


/**Temp method for main page
 * maybe change to redirection to the main store?
 */
app.get('/', (req, res) => {
    res.send("Hello");
});


/** Adding a product to database
 *  Base_Status: 70% complete.
 *  Status: 60% complete.
 *  SIDE NOTE-> num of votes is needed just for calcs
 *  Problems :
 *  1. Cloud needed to add in path.
 *  2. make it async function
 *  3. voting calculator (block from double)
 *  *  YET TO B TESTED
 */
// :param -> req.params.param
app.post(':id/addproduct', async (req, res) => {
    let user = (await whereSQLmain("users", "id", req.params.id)).valueOf()[0];
    if (user.permission_level >= 2) {
        res.status(401).json("Not Authorized");
        return;
    }
    let id = generateNewIDforObject("product");
    if (req.body.image.getExtension() !== "png" && req.body.image.getExtension() !== "jpeg") {
        res.status(403).json("Extention Problem");
        return
    }
    let product = {
        id: id,
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        image: imagesPath + "/" + req.body.image,//jpeg,png file path to cloud ??
        color: req.body.color,// 6 digit hex
        price: req.body.price,
        rating: 0,
        /*
        usersVoted:[];
        sumratings: 0,
        numvote: 0,
         */
    };
    redisClient.hset('products', id, JSON.stringify(product), (err, results) => {
        if (err) console.log(err);
    });
});


// app.get("/route", (req,res)=>{/*priveleges need to add next in sig})*/
//
// });
/** FROM HERE EVERY ROUTE THAT CAN ONLY BE ACCESSIBLE AFTER LOGIN LIKE CART
 *
 */

// table Product_ID, UserID , Rating
// three function needed , all the cart need to have object {product: prodObj , quantity: Number(int)}
/**Add item to cart
 *  Base_Status: 0% complete.
 *  Status: 0% complete.
 *  1.cookies
 *  2 many more
 */
//TODO API
//let id = req.params.id; // create var name
app.post(':id/:category/:product/addtocart', async (req, res) => {
    let user = (await whereSQLmain("users", "id", req.params.id)).valueOf()[0];
    let prodID = req.params.product.id;
    let product = (await whereSQLmain("products", "name", prodID)).valueOf()[0];
    let cart = user.cart;
    let index = await findProductInCart(cart, prodID);
    let result;
    let message;
    //CASE ERROR UNEXPECTED??
    if (index !== -1) {
        // exist in cart
        result = cart[index];
        result.quantity += 1;
        message = "The Item's quantity increases by 1";
    } else {
        //let quantity = 1||req.params.quantity; /:quantity
        result = {product: product, quantity: 1};//quantity:quantity
        message = "Item was successfully added to cart";
    }
    let newCart = await pushItemToObject(user, "cart", result);
    await updateObjectIndb("users", user, "cart", newCart);
    res.status(200).send(message);
});
/**Add item to cart
 *  Base_Status: 0% complete.
 *  Status: 0% complete.
 *  1. cookies
 *  2. many more
 *  *  YET TO B TESTED
 */
app.post(':id/cart/:product/addone', async (req, res, next) => {
    //add items to cart..
    let user = (await whereSQLmain("users", "id", req.params.id)).valueOf()[0];
    let cart = user.cart;
    let index = await findProductInCart(cart, req.params.id);
    if (index === -1) {
        //ERROR CONTROL
        res.status(400).json("Unauthorized");
        return;
    }
    let result = cart[index];
    result.quantity += 1;
    let message = "Item's quantity is does increase by 1";
    let newCart = await pushItemToObject(user, "cart", result);
    await updateObjectIndb("users", user, "cart", newCart);
    res.status(200).send(message);
});

/**remove item to cart
 *  Base_Status: 0% complete.
 *  Status: 0% complete.
 *  1.cookies
 *  2. many more
 *  *  YET TO B TESTED
 */
app.post(':id/cart/:product/removeone', async (req, res) => {
    // remove 1 items from cart..
    // if quantity == 1 => removeall
    // TOLEARN : redirect + cookies
    let user = (await whereSQLmain("users", "id", req.params.id)).valueOf()[0];
    let cart = user.cart;
    let product = (await whereSQLmain("products", "id", req.params.product)).valueOf()[0];
    let index = await findProductInCart(cart, product);
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
        result = await removeItemFromCart(cart, product);
        message = `Since only one ${product.name} was in cart it was removed`;
    } else {
        // remove 1
        result = await updateQuantityInCart(cart, index, -1);
        message = "Item's quantity is does decreased by 1";
    }
    await updateObjectIndb("users", user, "cart", result);
    res.status(200).send(message);
});
/**remove all the item From cart
 * Status: 0% complete
 * 1.cookies
 * 2. many more
 * *  YET TO B TESTED
 */
app.delete(':id/cart/:product/removeall', async (req, res) => {
    let user = (await whereSQLmain("users", "id", req.params.id)).valueOf()[0];
    let cart = user.cart;
    let product = (await whereSQLmain("products", "id", req.params.product)).valueOf()[0];
    let index = await findProductInCart(cart, product);
    if (index === -1) {
        //Quan = 0 , item not in cart
        res.status(500).json("Not in cart");
        return;
    }
    let newCart = await removeItemFromCart(cart, product);
    await updateObjectIndb("users", user, "cart", newCart);
    res.status(200).send("Item Was Successfully removed");
});
/**Calculator valid (need multiply and add)+ checkout
 *  Base_Status: 0% complete.
 *  Status: 0% complete.
 * *  YET TO B TESTED
 */
app.post(':id/cart/:price/checkout', async (req, res) => {
    let user = (await whereSQLmain("users", "id", req.params.id)).valueOf()[0];
    let cart = user.cart;
    let result = await quancheck(cart);
    if (result === "NOPE") {
        // ERROR with quantities
        res.status(500).json("Some went wrong with quantities");
        return;
    }
    let priceCheck = await priceCheck(cart);
    if (priceCheck === -1) {
        //error empty cart
        res.status(400).json("Cannot checkout empty car");
        return;
    }
    if (priceCheck !== req.params.price) {
        res.status(500).json("Error with Prices");
        return;
    }

    //ok
    let date = new Date().toUTCString();
    let purchaseObj = {cart: cart, price: priceCheck, date: date};
    let newPurchases = await pushItemToObject(user, "purchases", purchaseObj);
    await updateObjectIndb("users", user, "purchases", newPurchases);
    await updateObjectIndb("users", user, "cart", []);
    res.send(200).json(`Purchase complete, You can look in your personal purchases to see it. Thank you for buying at Flint, 
    the place to ignite your camping adventure`);
//   let id = user.id;
//    res.redirect("/" + id);
});
/** Category filter..
 *  Base_Status: 0% complete.
 *  Status: 0% complete.
 *  YET TO B TESTED
 */
// TODO API
//parameter category + user id ?
app.get(':id/:category', async (res, req) => {
    // if category === "general" ->all
    // maybe send to this user?
    let category = req.params.category;
    let afterFilter;
    if (category === " ") {
        afterFilter = await getallType("products");
    } else {
        afterFilter = await whereSQLmain("products", "category", category);
    }
    res.status(200).json(afterFilter);
});


app.post(':id/purchases', async (res, req) => {
    // maybe send to this user?
    let user = req.params.id;
    res.status(200).json(user.purchases);
});
/**All those functions
 *  Base_Status: 0% complete.
 *  Status: 20% complete
 */

app.delete('/:id/:product',async (req, res) => {
    let user = (await whereSQLmain("users", "id", req.params.id)).valueOf()[0];
    if(user.permission_level>=2){
        //error
    }
    let product = (await whereSQLmain("products", "id", req.params.product)).valueOf()[0];
    // remove from db,

    // remove item from store
    // TOLEARN : redirect + cookies
});

/** Stop Sale?
 *
 */
app.post('/', (req, res) => {
    // give a status of sell or not sell

    // remove item from store
    // TOLEARN : redirect + cookies
});
/** Add rating votes
 *
 *  problems:
 *  1. how to get item
 *  2. get product from key
 *  Base_Status: 0% complete.
 *  Status: 20% complete
 */
app.post('', (req, res) => {

});
// /** Add search
//  *
//  *  Base_Status: 0% complete.
//  *  Status: 20% complete
//  */
// app.post('/:id/:query', (req, res) => {
//
// });
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
        while (!redisClient.exists(newID)) {
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

function checkEmailPassword(email, password) {
    return new Promise(resolve => {
        getAllFieldsByType1("users", "email", "password", (results) => {
            let emailarr = results.map(i => i[0]);//i => 2D array , each row [email,pass]
            let index = emailarr.indexOf(email);// search for value of email in email array
            if (index === -1) {
                // if cannot found => not in DB => not registered
                resolve("not registered");
                return;
            }
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


/**returns the password need work due how to build
 *
 * @param user
 * Status: 20% complete
 * need to hash the password and authentication
 * Base_Status: 100% complete.
 * Status: 100% complete
 */
function passwordret(user) {
    return user.password;
}

/** updating the rating
 *
 * @param product - the product given a rating
 * @param rating - the new rating given by user
 * Status: 60% complete
 * problem : need to lock somehow the user from double voting, bought item in past, only if logged in ..
 */

/*
function updateRating(product, rating) {
    product.sumratings += rating;
    product.numvote += 1;
    product.rating = product.sumratings / product.numvote;
}
*/
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
    await redisClient.hset(type, object.id, JSON.stringify(object), (err,results)=>{
        if(err) console.log(err);
    });
    return "OK";
}

//TODO API
function findProductInCart(cart, productID) {
    let newCart = cart.map(obj => obj.product.id);
    return newCart.indexOf(productID);
}

//TODO API
function removeItemFromCart(cart, product) {
    return new Promise((resolve) => {
        let array = cart.filter(obj => obj.product !== product);
        resolve(array);
    });
}

//TODO API
function updateQuantityInCart(cart, index, value) {
    let temp = value * (-1);
    if (temp >= cart[index].quantity) {
        removeItemFromCart(cart, cart[index].product);
        return;
    }
    return new Promise(() => {
        let newCart = cart;
        newCart[index].quantity += value;
        resolve(newCart);
    });
}

//TODO API
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

// cart {p: ,quan: }
//TODO API
function priceCheck(cart) {
    return new Promise((resolve) => {
        let priceandquan = cart.map(obj => [obj.product.price, obj.quantity]);// 2dARR
        let calc = priceandquan.map(arr => arr[0] * arr[1]);// price*quantity
        resolve(calc.reduce((sum, cur) => sum + cur, -1));
    });
}

// Server listening
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});