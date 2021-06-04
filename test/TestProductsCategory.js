/*jshint esversion: 6 */
/*jshint esversion: 8 */
"use strict";
const fetch = require('node-fetch');
fetch("http://localhost:3001/categories/camping_accessories",
{
    method: 'POST', // or 'PUT'
        headers: {
    'Content-Type': 'application/json',
},
    body: JSON.stringify(),

})
.then(response => response.json())
    .then(data => {
        console.log('Success:',data );
    })
    .catch((error) => {
        console.error('Error:', error);
    });

fetch("http://localhost:3001/categories/culinary",
    {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

fetch("http://localhost:3001/categories/storage",
    {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
fetch("http://localhost:3001/categories/clothes",
    {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
// "camping accessories";_
// "culinary";
// "storage";
// "clothes";

fetch("http://localhost:3001/categories/camping_accessories",
    {
        method: 'POST', // or 'PUT
    }
)
.then(response => response.json())
    .then(data => {
        console.log('Success:',data );
    })
    .catch((error) => {
        console.error('Error:', error);
    });