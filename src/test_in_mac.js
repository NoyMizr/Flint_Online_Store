const data = {email: "example@example.com", password: "aA3", remail: "example@example.com", rpassword: "aA3", name:"examp"};
fetch('http://localhost:3001/register', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
})
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

//error email not same
const data2 = {email: "example1@example.com", password: "aA3", remail: "example@example.com", rpassword: "aA3", name:"examp"};
fetch('http://localhost:3001/register', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data2),
})
    .then(response => response.json())
    .then(data2 => {
        console.log('Success:', data2);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

// no error
const data3 = {email: "example1@example.com", password: "aA3", remail: "example1@example.com", rpassword: "aA3", name:"examp"};
fetch('http://localhost:3001/register', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data3),
})
    .then(response => response.json())
    .then(data3 => {
        console.log('Success:', data3);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

//error not same pass
const data4 = {email: "example2@example.com", password: "aA31", remail: "example2@example.com", rpassword: "aA32", name:"examp"};
fetch('http://localhost:3001/register', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data4),
})
    .then(response => response.json())
    .then(data4 => {
        console.log('Success:', data4);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

// illgal pass (no small)
const data5 = {email: "example2@example.com", password: "A31", remail: "example2@example.com", rpassword: "A31", name:"examp"};
fetch('http://localhost:3001/register', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data5),
})
    .then(response => response.json())
    .then(data5 => {
        console.log('Success:', data5);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

// illgal pass (no capital)
const data6 = {email: "example2@example.com", password: "a31", remail: "example2@example.com", rpassword: "a31", name:"examp"};
fetch('http://localhost:3001/register', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data6),
})
    .then(response => response.json())
    .then(data6 => {
        console.log('Success:', data6);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

const data7 = {email: "example2@example.com", password: "aAb", remail: "example2@example.com", rpassword: "aAb", name:"examp"};
fetch('http://localhost:3001/register', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data7),
})
    .then(response => response.json())
    .then(data7 => {
        console.log('Success:', data7);
    })
    .catch((error) => {
        console.error('Error:', error);
    });



