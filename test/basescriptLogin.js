// let fetch = require("node-fetch");
// fetch('http://localhost:3001/users');

//
// /** NEW SCRIPT TO RUN AFTER LOGIN IS FIXED
//  *  WITHOUT UNDEFINED ERRORS ..
//  */
let data = {
    email: "example@example.com",
    password: "aA3",
    remail: "example@example.com",
    rpassword: "aA3",
    name: "examp"
};
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
fetch('http://localhost:3001/users');
let data1 = {
    email: "example@example.com",
    password: "aA3",
    remail: "example@example.com",
    rpassword: "aA3",
    name: "examp"
};
fetch('http://localhost:3001/register', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data1),
})
    .then(response => response.json())
    .then(data1 => {
        console.log('Success:', data1);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
fetch('http://localhost:3001/users');
//error email not same
let data2 = {
    email: "example1@example.com",
    password: "aA3",
    remail: "example@example.com",
    rpassword: "aA3",
    name: "examp"
};
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
fetch('http://localhost:3001/users');
// no error
let data3 = {
    email: "example1@example.com",
    password: "aA3",
    remail: "example1@example.com",
    rpassword: "aA3",
    name: "examp"
};
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
fetch('http://localhost:3001/users');
//error not same pass
let data4 = {
    email: "example2@example.com",
    password: "aA31",
    remail: "example2@example.com",
    rpassword: "aA32",
    name: "examp"
};
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
fetch('http://localhost:3001/users');
// illgal pass (no small)
let data5 = {
    email: "example2@example.com",
    password: "A31",
    remail: "example2@example.com",
    rpassword: "A31",
    name: "examp"
};
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
fetch('http://localhost:3001/users');
// illgal pass (no capital)
let data6 = {
    email: "example2@example.com",
    password: "a31",
    remail: "example2@example.com",
    rpassword: "a31",
    name: "examp"
};
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
fetch('http://localhost:3001/users');
let data7 = {
    email: "example2@example.com",
    password: "aAb",
    remail: "example2@example.com",
    rpassword: "aAb",
    name: "examp"
};
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
fetch('http://localhost:3001/users');

let data111 = {email: "example@example.com", password: "aA3"};
fetch('http://localhost:3001/login', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data111),
})
    .then(response => response.json())
    .then(data111 => {
        console.log('Success:', data111);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
fetch('http://localhost:3001/users');
// not right password
let data52 = {
    email: "example@example.com",
    password: "A311",
};
fetch('http://localhost:3001/login', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data52),
})
    .then(response => response.json())
    .then(data52 => {
        console.log('Success:', data52);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
fetch('http://localhost:3001/users');
// not in db
let data11 = {email: "example2342@example.com", password: "aA31"};
fetch('http://localhost:3001/login', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data11),
})
    .then(response => response.json())
    .then(data11 => {
        console.log('Success:', data11);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
fetch('http://localhost:3001/users');
let data48 = {email: "example@example.com", password: "aA3"};
fetch('http://localhost:3001/login', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data48),
})
    .then(response => response.json())
    .then(data48 => {
        console.log('Success:', data48);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
fetch('http://localhost:3001/users');