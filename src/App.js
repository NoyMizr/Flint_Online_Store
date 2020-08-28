import React, {useState} from 'react';
import './App.css';
import 'antd/dist/antd.css';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import {Layout, Menu, Input} from 'antd';
import Title from 'antd/lib/typography/Title';

import {UserOutlined, LoginOutlined, UserAddOutlined, AudioOutlined} from '@ant-design/icons';
import Login from "./components/Login";
import Registration from "./components/Registration";

const {Search} = Input;
const {Header, Content, Sider} = Layout;


const {SubMenu} = Menu;

function App() {
    return (
        <Router>
            <div className="App">
                <Layout>

                    <Header style={{
                        position: 'fixed', zIndex: 1, width: '100%', display: "flex",
                        alignItems: "center", justifyContent: "space-between"
                    }}>
                        <Title style={{color: 'white'}} level={1}>
                            <Link to="/" style={{color: "white"}}>Flint</Link>
                        </Title>
                        <div className="search1">
                            <Search
                                placeholder="search"
                                onSearch={value => console.log(value)}
                                style={{width: 300}}
                            />
                        </div>
                        <Menu theme="dark" mode="horizontal">
                            <Menu.Item icon={<LoginOutlined/>} key="1">
                                <Link to="/login">Login</Link>
                            </Menu.Item>
                            <Menu.Item icon={<UserAddOutlined/>} key="2">
                                <Link to="/register">Register</Link>
                            </Menu.Item>
                        </Menu>
                    </Header>

                    <Layout>

                        <Sider trigger={null}>
                            <div className="logo"/>
                            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                                <Menu.Item key="1" icon={<UserOutlined/>}>
                                    nav
                                </Menu.Item>
                            </Menu>
                        </Sider>

                        <Content style={{minHeight: "100vh"}}>
                            <Switch>
                                <Route exact path="/">
                                    <div>

                                    </div>
                                </Route>
                                <Route path="/login">
                                    <Login/>
                                </Route>
                                <Route path="/register">
                                    <Registration/>
                                </Route>
                            </Switch>
                        </Content>

                    </Layout>
                </Layout>
            </div>
        </Router>
    );
}

export default App;
