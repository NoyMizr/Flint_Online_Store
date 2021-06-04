fetch("http://localhost:3001/admin/editproduct",
    {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({product:"product_fI08G3nQLw",field:"price",newValue:60}),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:',data );
    })
    .catch((error) => {
        console.error('Error:', error);
    });

fetch("http://localhost:3001/product_JSLhbLNwOW7/rating/4",
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

fetch("http://localhost:3001/cart/150/checkout",
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
