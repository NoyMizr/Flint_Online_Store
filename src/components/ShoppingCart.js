import React, {useState} from 'react';
import {Layout, Breadcrumb, Row, Col, Table, Space, Divider, Statistic, Button, Form,} from 'antd';
import { CreditCardOutlined, DeleteOutlined,ShoppingOutlined } from '@ant-design/icons';
import Title from "antd/lib/typography/Title";
import {BrowserRouter as Router, Link} from "react-router-dom";
import CartRow from "./CartRow";
const { Content } = Layout;



    const ShopppingCart = (props) => {
        const [cart, setCart]= useState(null);

        const onClear = () => {
            fetch("http://localhost:3001/cart/emptycart",
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
        };
    const columns = [
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },{
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },{
            title: 'Total Price',
            dataIndex: 'total',
            key: 'total',
        },
    ];

    // const total = [0];
    // props.cart.forEach((elem) => total.push(+elem.itemPrice.replace('$', '')));

    return (
        <Router>
        <div>
            <section className="category">
                {cart.map(row => <CartRow key={row.product.id}
                                               id={row.product.id}
                                               image={row.product.image}
                                               name={row.product.name}
                                               price={row.product.price}
                                               description={row.product.description}
                                               quantity={row.quantity}
                                               total = {Number(row.quantity)*Number(row.product.price)}
                />)}

            </section>
            <Layout>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <Content className='site-layout-background'>
                    <header> <Title style={{color: 'BLACK',  position: 'fixed',
                        marginLeft: '450px',
                        marginRight: '300px',
                    marginTop: '20px'}}level={2}>Shopping Cart</Title>
                    </header>
                    <br></br>
                    <Row justify='end'>
                        <Col>
                            <Button type='default' onClick={onClear} danger>
                                <DeleteOutlined />
                                &nbsp;
                                <span>Delete Cart</span>
                            </Button>
                        </Col>
                    </Row>
                    {/*<h2>*/}
                    {/*    Total Items <strong>({props.cart.length})</strong>*/}
                    {/*</h2>*/}
                    <br></br>
                    <Table columns={columns} dataSource={props.cart} pagination={false} />
                    <Row justify='start'>

                    </Row>
                    <br></br>
                    <Row justify='end'>
                        <Col>
                            {/*<Statistic*/}
                            {/*    title='Total (tax incl).'*/}
                            {/*    value={`$ ${Math.round(*/}
                            {/*        total.reduce((total, num) => total + num)*/}
                            {/*    ).toFixed(2)}`}*/}
                            {/*    precision={2}*/}
                            {/*/>*/}
                            <Button style={{ marginTop: 16,  marginLeft: '500px',
                                marginRight: '600px'}} type='primary' onClick={() => window.location.href= "/CheckOut"}>
                             Check out <ShoppingOutlined />
                            </Button>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </div>
        </Router>
    );
};


export default ShopppingCart;