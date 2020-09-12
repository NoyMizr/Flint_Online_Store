import React, {useState} from 'react';
import 'antd/dist/antd.css'
import {Layout, Menu, Breadcrumb, Button, PageHeader, Input, AutoComplete, Rate, Row, Col, Table} from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';

import { Space, Card } from 'antd';
import Title from "antd/lib/typography/Title";
import {CreditCardOutlined, DeleteOutlined} from "@ant-design/icons";
import Product from "./Product";
const { Content } = Layout;

function RatingPage({id,rating }) {
    const [products, setProducts] = useState([]);
// the rating should be the number of stars given to product, the field returning this value is called "count"(Number)
    //
    const onclick = ()=>{
        fetch(`http://localhost:3001/product/${id}/rating/${rating}`,
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
    };


    return (
        <Router>
        <div style={{background:'lightgrey', marginTop: '100px'}}>
            <section className="category">
                {products.map(product => <Product name={product.name}/>)}
            </section>
            <Layout>
                <Content className='site-layout-background'>
                    <header> <Title style={{color: 'BLACK',  position: 'fixed',
                        marginLeft: '450px',
                        marginRight: '300px',
                        marginTop: '60px'
                    }}level={2}>Rate {'name'} Product!</Title>
                    </header>
                    <br></br>

                </Content>
            </Layout>
            <Rate
                style={{marginTop: '150px', marginLeft: '430px', marginRight: '400px', }}>
            </ Rate>
            <br></br>
            <br></br>
            <br></br>
            <Button type="primary"style={{marginTop:'100px', marginLeft: '310px',
                marginRight: '300px'}}onClick={onclick}>Add your rating!</Button>

        </div>
        </Router>

    );
};

export default RatingPage;