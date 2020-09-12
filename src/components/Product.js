
import React, {useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Link,} from 'react-router-dom';

import 'antd/dist/antd.css'
import {Layout, Menu, Breadcrumb, Button, PageHeader, Input, AutoComplete, Rate, Form, Typography, notification} from 'antd';
import {Space, Card} from 'antd';
import ShoppingCart from "./ShoppingCart";
import RatingPage from "./RatingPage";
const {Text,} = Typography;

const productToImage = {

}

function Product(props) {
    let product = props;

    const onClick = () => {
        fetch(`http://localhost:3001/products/${product.id}/addtocart`, {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                notification.info('Success: ' + data);
            })
            .catch(error => {
                notification.error('Error: ' + error);
            });
    };
    return (

            <Space direction="vertical">
                {/*<h2>Product</h2>*/}
                <Card type="text" id="name" title={product.name} style={{width: 300}}>
                    <img src ={product.image} width={100}/>

                    <p type="text" id="desc">Description: {product.description}</p>
                    <p type="text" id="price">Price: {product.price}$</p>
                    <p type="text" id="desc">Rate:<Rate disabled defaultValue= {product.rating}/></p>
                    {/*<button type="submit" formAction="./ShoppingCart">Add To Cart</button>*/}
                    <Layout>
                        <Link to="/RatingPage" >
                            <Text underline id={product.id}>Rate This Product!</Text>
                        </Link>
                    </Layout>
                    <br></br>
                    <br></br>
                    <Button type="primary" onClick={onClick}>
                        Add To Cart
                    </Button>


                    {/*<Button  type="primary" ghost onClick={() => window.location.href='/ShoppingCart'}>*/}
                    {/*    Add To Cart*/}
                    {/*</Button>*/}



                        {/*// <Link to="/shoppingcart">*/}
                        {/*// </Link>*/}

                </Card>
            </Space>


    );
};

export default Product;

