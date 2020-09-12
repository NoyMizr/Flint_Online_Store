import React, {useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Link,} from 'react-router-dom';

import {
    Layout,
    Button,
    Rate,
    Typography,
    notification
} from 'antd';
import {Space, Card} from 'antd';
import axios from 'axios';

const {Text,} = Typography;

function Product(props) {
    let product = props;

    const onClick = () => {
        axios.post(`http://localhost:3001/products/${product.id}/addtocart`, null, {withCredentials: true})
            .then(data => {
                props.setUser({...props.user, cart: data.data})
                notification.info({message: `Success! Added ${product.name} to cart`});
            })
            .catch(error => {
                notification.error({message: 'Failed: ' + error});
            });
    };
    return (

        <Space direction="vertical">
            <Card type="text" id="name" title={product.name} style={{width: 300}}>
                {props.user.permission_level ===1 ? <Link to={`/edit/${product.id}`}>Edit</Link> : ''}
                <div style={{height: '150px'}}>
                    <img src={product.image} width={100}/>
                </div>

                <p type="text" id="desc" style={{height: '70px'}}>Description: {product.description}</p>
                <p type="text" id="price">Price: {product.price}$</p>
                <p type="text" id="desc">Rate:<Rate disabled defaultValue={product.rating}/></p>
                <Layout>
                    <Link to={`/RatingPage/${product.name}/${product.id}`}>
                        <Text underline >Rate This Product!</Text>
                    </Link>
                </Layout>
                <br></br>
                <br></br>
                <Button type="primary" onClick={onClick}>
                    Add To Cart
                </Button>
            </Card>
        </Space>


    );
};

export default Product;

