import React, {useState} from 'react';


var NewComponent = React.createClass({
    render: function() {
        return (
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                    <title>ReadMe</title>
                    <h3>ReadMe- Final Project</h3>
            </head>
            <body>
            * Store name- Flint
            <br>
                *What are you selling- Camping Product
                <br>
                    * What additional page(s) did you add? How to operate them-
                    <br>
                        1. Rating Product-We created "rating" function, this function make some validations and get from
                        the frontend a rating between 1-5 (int only) , and the product id and look it up in Redis.
                        Then it check whether the user already voted or not. if the user did vote ->editing the existing vote, otherwise
                        , adds the new rating to sum and calculate the average of rating. In both cases update in DB and displays the new rating
                        <br>
                            2. Edit Product- We created editproduct function , this function allows the admin the edit an existing product ,
                            by giving to this function , the product id, a field and a new value, then it checks the validity of the value according to
                            the field given(like price that have a non positive value ) , and doesn't allow to add new values to the product. Then it updates the DB. Moreover not every field can be updated
                            like product'id, rating, and more.
                            <br>
                                * What was hard to do?  It was hard for me to sync between the the Backend and the Frontend, use the mapping operation and adherence to schedule

                                <br>
                                    * Who is your partner? Tal Danai 205894579
                                    <br>
                                        * What did you do? What did your partner do?-  I did the Frontend side and Tal the Backend, And we did the sync together
                                        while constantly updating each other about our status
                                        <br>
                                            * Specify all the different route your app supports- L1.	http://localhost:3001/register<br>
                                            2.	http://localhost:3001/login<br>
                                            3.	http://localhost:3001/connected-user<br>
                                            4.	http://localhost:3001/logout<br>
                                            5.	http://localhost:3001/login<br>
                                            6.	http://localhost:3001/admin/addproduct<br>
                                            7.	http://localhost:3001/admin/editproduct<br>
                                            8.	http://localhost:3001/admin/purchases<br>
                                            9.	http://localhost:3001/admin/sessions<br>
                                            10.	http://localhost:3001/products/:product<br>
                                            11.	http://localhost:3001/products/:product/addtocart<br>
                                            12.	http://localhost:3001/cart/:product/addone<br>
                                            13.	http://localhost:3001/cart/:product/removeone<br>
                                            14.	http://localhost:3001/cart/:product/removeallProduct<br>
                                            15.	http://localhost:3001/checkout/:price<br>
                                            16.	http://localhost:3001/search/searchproduct<br>
                                            17.	http://localhost:3001/categories/:category<br>
                                            18.	http://localhost:3001/purchases<br>
                                            19.	http://localhost:3001/admin/:user/purchases<br>
                                            20.	http://localhost:3001/products/:product/rating/:rating<br>

                                            * How did you make your store secured?- we never send a password info (only to admin) , admin’s info not send to anyone.
                                            we block with sessions and cookies they option to have multiple login times.
                                            <br>
                                                * Did you implement the store using react.js?-  Yes

            </body>
            </html>
    );
    }
    });