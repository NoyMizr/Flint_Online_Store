import React, {useState, useEffect} from 'react';
import {Layout, Breadcrumb, Row, Col, Table, Space, Divider, Statistic, Button, Form,Radio, Input } from 'antd';
import { CreditCardOutlined, DeleteOutlined } from '@ant-design/icons';
import Title from "antd/lib/typography/Title";
import {BrowserRouter as Router} from "react-router-dom";
import AdminRow from "./AdminRow";
const { Content } = Layout;


const Admin = (props) => {
    const [users,setUsers]= useState([]);
    // const mapStateToProps = (state) => ({
    //     cart: state.cart,
    // });
    //
    // const mapDispatchToProps = (dispatch) => ({
    //     removeCart: () => dispatch({ type: 'DELETE_CART' }),
    // });
    const getUsers = ()=>{
        fetch('http://localhost:3001/admin/users', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({

            }),
        }).then(res => res.json()).then(data =>
        setUsers(data))
    };
    useEffect(getUsers,[]);
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Last Login',
            dataIndex: 'login',
            key: 'login',
        },{
            title: 'Full History Of Login',
            dataIndex: 'amount',
            key: 'amount',
        },{
            title: 'Last Purchase',
            dataIndex: 'total',
            key: 'total',
        },{
            title: 'Full History Of Purchase',
            dataIndex: 'total',
            key: 'total',
        },
    ];

    // const total = [0];
    // props.cart.forEach((elem) => total.push(+elem.itemPrice.replace('$', '')));

    return (
        <Router>
        <section>
            {users.map(user => <AdminRow email={user.email}
                                    name ={user.name}
                                    lastLogin={user.logins[user.logins.length-1]}
                                    history={user.logins}
                                    lastPurchase ={user.purchases[user.purchases.length-1]}
                                    fullHistory = {user.purchases}
            />)}
            <div>
                <Layout>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Content className='site-layout-background'>
                        <header> <Title style={{color: 'BLACK',  position: 'fixed',
                            marginLeft: '600px',
                            marginRight: '300px',
                            marginTop: '20px'} }level={2}>Users</Title>
                        </header>
                        <br></br>
                        <br></br>
                        <Row justify='end'>
                            <Col>
                            </Col>
                        </Row>
                        <br></br>
                        <Table columns={columns} dataSource={props.cart} pagination={false} />
                        <Row justify='start'>

                        </Row>
                        <br></br>
                        <Row justify='end'>
                            <Col>
                            </Col>
                        </Row>
                    </Content>
                </Layout>
            </div>
        </section>
        </Router>

    );
};


export default Admin;