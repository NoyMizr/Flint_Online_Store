import React, {useState} from 'react';
import './App.css';
import 'antd/dist/antd.css';
import {BrowserRouter as Router, Switch, Route, Link,} from 'react-router-dom';
import {Layout, Menu, Input} from 'antd';
import Title from 'antd/lib/typography/Title';

import {UserOutlined, LoginOutlined, UserAddOutlined, ShoppingCartOutlined,LogoutOutlined, DownOutlined } from '@ant-design/icons';
import Login from "./components/Login";
import Registration from "./components/Registration";

const {Search} = Input;
const {Header, Content, Sider} = Layout;


const {SubMenu} = Menu;

function App(name, id) {
    const [user, setUser]= useState({name: 'Noy'});

    const logout = ()=> {
        setUser(null)
    }
    return (
        <Router>
            <div className="App">
                <Layout>

                    <Header style={{
                        position: 'fixed', zIndex: 1, width: '100%', display: "flex",
                        alignItems: "center", justifyContent: "space-between"
                    }}>
                        <Title level={1}>
                            <Link to="/" style={{color: "white"}}>Flint</Link>
                        </Title>
                        <div className="search1">
                            <Search
                                placeholder="search"
                                onSearch={value => console.log(value)}
                                style={{width: 300}}
                            />
                        </div>
                        <div>


                            {!user ? <Menu theme="dark" mode="horizontal"><Menu.Item icon={<LoginOutlined/>} key="1">
                                    <Link to="/login">Login</Link>
                                </Menu.Item>
                                <Menu.Item icon={<UserAddOutlined/>} key="2">
                                    <Link to="/register">Registerion</Link>
                                </Menu.Item></Menu> :
                                <Menu theme="dark" mode="horizontal">
                                    <Menu.Item icon={<UserOutlined />} key="0">Hello {user.name}
                                </Menu.Item>
                                <Menu.Item icon={<LogoutOutlined />} key="1" onClick={logout}>
                                    Logout
                                </Menu.Item>
                                <Menu.Item icon={<ShoppingCartOutlined />} key="2">
                                <Link to="/">cart</Link>
                                </Menu.Item></Menu>
                            }


                        </div>
                    </Header>
                    <Layout>
                        <Sider trigger={null}>
                            <div className="logo"/>
                            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                                <Menu.Item key="1" icon={<UserOutlined/>}>
                                    nav
                                </Menu.Item>
                                <Menu.Item key="1">
                                    <Link to="/cooking">Cooking and water</Link>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Link to="/register">Clothing</Link>
                                </Menu.Item>
                                <Menu.Item key="3">
                                    <Link to="/register">Sleeping and shading</Link>
                                </Menu.Item>
                                <Menu.Item key="4">
                                    <Link to="/register">Storage</Link>
                                </Menu.Item>
                                <Menu.Item key="5">
                                    <Link to="/register">General</Link>
                                </Menu.Item>

                            </Menu>
                        </Sider>

                        <Content style={{minHeight: "100vh"}}>
                            <Switch>
                                <Route exact path="/">
                                    <div>
                                        path=
                                    </div>
                                </Route>
                                <Route path="/login">
                                    <Login setUser={setUser}/>
                                </Route>
                                <Route path="/register">
                                    <Registration user={'bla'}/>
                                </Route>
                                <Route path={'/cooking'}>
                                     {/*<Category name={'Cooking'}/>*/}
                                </Route>
                            </Switch>
                        </Content>.ֿ

                    </Layout>
                </Layout>
            </div>
        </Router>

    );
}


export default App;
