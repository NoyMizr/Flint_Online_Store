import React, {useEffect, useState} from 'react';
import './App.css';
import 'antd/dist/antd.css';
import {BrowserRouter as Router, Switch, Route, Link, Button, message, Tooltip } from 'react-router-dom';
import {Layout, Menu, Input, Dropdown} from 'antd';
import Title from 'antd/lib/typography/Title';
import {useCookies} from "react-cookie";

import {UserOutlined, LoginOutlined, UserAddOutlined, ShoppingCartOutlined, LogoutOutlined,ReadOutlined, DownOutlined} from '@ant-design/icons';
import Login from "./components/Login";
import Registration from "./components/Registration";
import ShoppingCart from "./components/ShoppingCart";
import Category from "./components/Category";
import CheckOut from "./components/CheckOut";
import RatingPage from "./components/RatingPage";
import Admin from "./components/Admin";
import CartRow from "./components/CartRow";
import AdminRow from "./components/AdminRow";

const {Search} = Input;
const {Header, Content, Sider} = Layout;


const {SubMenu} = Menu;

function App(name, id) {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState(null);
    const [cookies, setCookies] = useCookies(['connect.sid'])
    useEffect(() => {
        console.log('cookies:')
        console.log(cookies)
    }, [user])

    const logout = () => {
        setUser(null);
        // fetch('http://localhost:3001/logout', {
        //     method: 'POST', // or 'PUT'
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // })
        //     .then(response => response.json()).catch((error) => {
        //         console.error('Error:', error);
        //     });
    };
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

                        {/*<div>*/}
                        {/*    const menu= () => {*/}
                        {/*    <Menu>*/}
                        {/*        <Menu.Item>*/}
                        {/*            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">*/}
                        {/*                1st menu item*/}
                        {/*            </a>*/}
                        {/*        </Menu.Item>*/}
                        {/*        <Menu.Item>*/}
                        {/*            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">*/}
                        {/*                2nd menu item*/}
                        {/*            </a>*/}
                        {/*        </Menu.Item>*/}
                        {/*        <Menu.Item>*/}
                        {/*            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">*/}
                        {/*                3rd menu item*/}
                        {/*            </a>*/}
                        {/*        </Menu.Item>*/}
                        {/*        <Menu.Item danger>a danger item</Menu.Item>*/}
                        {/*    </Menu>*/}
                        {/*};*/}

                        {/*    ReactDOM.render(*/}
                        {/*    <Dropdown overlay={menu}>*/}
                        {/*        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>*/}
                        {/*            Hover me <DownOutlined />*/}
                        {/*        </a>*/}
                        {/*    </Dropdown>,*/}
                        {/*    mountNode,*/}
                        {/*    );*/}
                        {/*</div>*/}

                        <div>
                            {!user ? <Menu theme="dark" mode="horizontal"><Menu.Item icon={<ReadOutlined />} key="1">
                                <Link to="/login">ReadMe</Link>
                            </Menu.Item>
                                <Menu.Item icon={<LoginOutlined/>} key="2">
                                <Link to="/login">Login</Link>
                            </Menu.Item>
                                <Menu.Item icon={<UserAddOutlined/>} key="3">
                                    <Link to="/register">Registerion</Link>
                                </Menu.Item></Menu> : !user.permission_level === 1 ?
                                <Menu theme="dark" mode="horizontal">
                                    <Menu.Item icon={<UserOutlined/>} key="0">Hello {user.name},
                                    </Menu.Item>
                                    <Menu.Item icon={<LogoutOutlined/>} key="1" onClick={logout}>
                                        Logout
                                    </Menu.Item>
                                    <Menu.Item icon={<ShoppingCartOutlined/>} key="2">
                                        <Link to="/ShoppingCart">cart</Link>
                                    </Menu.Item></Menu> :
                                <Menu theme="dark" mode="horizontal">
                                    <Menu.Item  key="0">Hello Admin {user.name},
                                    </Menu.Item>
                                    <Menu.Item icon={<UserOutlined/>} key="1">
                                        <Link to="/Admin">Users</Link>
                                    </Menu.Item>
                                    <Menu.Item icon={<LogoutOutlined/>} key="2" onClick={logout}>
                                        Logout
                                    </Menu.Item>
                                    <Menu.Item icon={<ShoppingCartOutlined/>} key="3">
                                        <Link to="/ShoppingCart">cart</Link>
                                    </Menu.Item></Menu>
                            }
                        </div>
                    </Header>
                    <Layout>
                        <Sider trigger={null}>
                            <div className="logo"/>
                            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                                <Menu.Item key="0" icon={<UserOutlined/>}>
                                    nav
                                </Menu.Item>
                                <Menu.Item key="1">
                                    <Link to="/camping_accessories">Camping Accessories</Link>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Link to="/clothing">Clothing</Link>
                                </Menu.Item>
                                <Menu.Item key="3">
                                    <Link to="/culinary">Culinary</Link>
                                </Menu.Item>
                                <Menu.Item key="4">
                                    <Link to="/hiking gear">Hiking gear</Link>
                                </Menu.Item>
                                <Menu.Item key="5">
                                    <Link to="/storage">Storage</Link>
                                </Menu.Item>
                                <Menu.Item key="6">
                                    <Link to="/general">General</Link>
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
                                <Route exact path={'/camping_accessories'}>
                                    <Category name={'camping_accessories'}/>
                                </Route>
                                <Route exact path={'/clothing'}>
                                    <Category name={'clothing'}/>
                                </Route>
                                <Route exact path={'/culinary'}>
                                    <Category name={'culinary'}/>
                                </Route>
                                <Route path={'/hiking_gear'}>
                                    <Category name={'hiking_gear'}/>
                                </Route>
                                <Route path={'/storage'}>
                                    <Category name={'storage'}/>
                                </Route>
                                <Route path={"/ShoppingCart"}>
                                    <ShoppingCart/>
                                </Route>
                                <Route exact path={"/CheckOut"}>
                                    <CheckOut/>
                                </Route>
                                <Route path={'/RatingPage'}>
                                    <RatingPage/>
                                </Route>
                                <Route path={'/Admin'}>
                                    <Admin/>
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