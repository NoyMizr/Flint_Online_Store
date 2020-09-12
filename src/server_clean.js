/* jshint esversion: 6 */
"use strict";

/*
add status HTTP to all errors
*/
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
let adminId = "user_admin";
let admin = {
    id: adminId,
    email: "taldanai@icloud.com",
    name: "Tal Danai",
    password: "1234Ac",
    logins: [], // contains date,hours in UTC, Local time
    purchases: [], //contains , purchase object that includes, items , prices, colors?, date, and after purchase clear cart
    cart: []        // should be in cookies?
};
client.hset("users", adminId, JSON.stringify(admin), redis.print);

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
            next("Missing Data");
            return;
        }
        // generate new id depending on the type of object in order in insert to first hash key
        let id = generateNewIDforObject("user");
        // check validity of email if is not valid. go to next, we want to wait here for data to return
        let emailVal = await checkValitdyEmail(req.body.email, req.body.remail);
        //error handling
        if (emailVal !== true) {
            next(emailVal);
            return;
        }
        //login need to find in db the mail
        //check validity of password if is not valid. go to next
        // TODO double entry via waiting check and maybe block somehow..
        let passVal = checkValidityPass(req.body.password, req.body.rpassword);
        //error handling
        if (passVal !== true) {
            next(passVal);
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
            cart: []        // should be in cookies?
        };
        // set the user into db , hashed
        client.hset('users', id, JSON.stringify(user), redis.print);
    }
);


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
/**This function is called by next, code is for second and third options
 * Validity of password and Missing Data in The registration form
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
    if (err === "Missing Data") {
        res.send("Missing Data in the request");
        res.flush();
        return;
    }
    // THIS SECTION IS FOR UNKNOWN ERRORS
    //  res.Error("Unknown Error");
});

/** This Function is a Helper debugging function that print all users
 *  Base_Status: 100% complete.
 *  Status: 100% complete.
 */
app.get('/users', (req, res) => {
    // console.log(checkValitdyEmail("example@example.com", "example@example.com"));
    const types = getAllTypeAsObj('users', (results) => {
//        console.log(results);
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
 * 3. personalized page (showing cart)
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
        next(ans);
        return;
    }
    // finds the user which has the value of the email given as is value
    let user = await whereSQLmain("users", "email", email).valueOf();
    // give the current date in UTC.
    let date = new Date().toUTCString();
    // TODO : COOKIE here + IF (LAST LOGIN - Current login<30 minute , login and renew cookie)
    // Pushes the last date in the logins array. and we want to wait for that
    let newLogins = await pushItemToObject(user[0], "logins", date); // user[0] -> since it returns in the let user line as an array with 1 value
    // We Update the DB accordingly
    updateObjectIndb("users", user[0], "logins", newLogins);
    // TODO need timeout cookie
    console.log("Log In Successfully");
});

/** ERROR handling due to mail is not found
 *  Statuses mentioned above
 */
app.post('/login', (err, req, res) => {
    if (err === "not registered") {
        res.send("Please Register or enter another mail");
        res.flush();
        return;
    }
    if (err === false) {
        res.send("Wrong Password");
        res.flush();
        return;
    }
    if (err === "Missing Data") {
        res.send("Missing Data in the request");
        res.flush();
        return;
    }
    //UNEXPECTED ERROR!
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
 */
app.get('/addproduct', (req, res) => {
    let id = generateNewIDforObject("product");
    let product = {
        id: id,
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        image: req.body.image,//jpeg,png file path to cloud
        color: req.body.color,// 6 digit hex
        price: req.body.price,
        rating: 0,
        /*
        usersVoted:[];
        sumratings: 0,
        numvote: 0,
         */
    };
    client.hset('products', id, JSON.stringify(product), redis.print);
});
// three function needed , all the cart need to have object {product: prodObj , quantity: Number(int)}
/**Add item to cart
 *  Base_Status: 0% complete.
 *  Status: 0% complete.
 *  1.cookies
 *  2 many more
 */
app.post(':id/categories/:product/addtocart', (req, res) => {
    let id = req.params.id; // create var name
    //add items to cart..

    // TOLEARN : redirect + cookies
    res.status().send()
});
/**Add item to cart
 *  Base_Status: 0% complete.
 *  Status: 0% complete.
 *  1. cookies
 *  2. many more
 */
app.post(':id/cart/:product/addone', (req, res) => {
    //add items to cart..

    // TOLEARN : redirect + cookies
});

/**Add item to cart
 *  Base_Status: 0% complete.
 *  Status: 0% complete.
 *  1.cookies
 *  2. many more
 */
app.post(':id/cart/:product/removeone', (req, res) => {
    // remove 1 items from cart..
    // if quantity == 1 => removeall
    // TOLEARN : redirect + cookies
});
/**Add item to cart
 * Status: 0% complete
 * 1.cookies
 * 2. many more
 */
app.delete(':id/cart/:product/removeall', (req, res) => {
    // add items to cart..
    // TOLEARN : redirect + cookies
});
/**Calculator valid (need multiply and add)
 *  Base_Status: 0% complete.
 *  Status: 0% complete.
 * 1. need to check mult things before
 */
app.post('', (req, res) => {

});
/** Category filter..
 *  many probs
 *  Base_Status: 0% complete.
 *  Status: 0% complete.
 */
//parameter category + user id ?
app.get(':id/categories/:category', (res, req) => {
    // if category === "general" ->all
});
/**Get all the products \ products from category
 *  Base_Status: 0% complete.
 *  Status: 20% complete
 */
app.get(':id/categories/:category', (req, res) => {
    const types = getAllTypeAsObj('users', (results) => {
        res.send(results);
    });
});

/**All those functions
 *  Base_Status: 0% complete.
 *  Status: 20% complete
 */

app.delete('/', (req, res) => {
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
        while (!client.exists(newID)) {
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
    return client.hgetall(type, (err, results) => {
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
    if (field2===field1){
        return "same type were chosen";
    }
    // get all type from redis
    return client.hgetall(type, (err, results) => {
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
    return client.hgetall(type, (err, results) => {
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
    return client.hgetall(type, (err, results) => {
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
                resolve(false);
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
        return "Not the same"
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
    await client.hset(type, object.id, JSON.stringify(object), redis.print);
    return "OK";
}

// Server listening
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

