import React, {useState} from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Button, PageHeader, Input, AutoComplete } from 'antd';
import Title from 'antd/lib/typography/Title';


import { MenuUnfoldOutlined, UserOutlined, LaptopOutlined, NotificationOutlined, AlignLeftOutlined ,LoginOutlined,UserAddOutlined,ShoppingCartOutlined, DingtalkOutlined } from '@ant-design/icons';
import Login from "./components/Login";
import Registration from "./components/Registration";
const { Search } = Input;
const { Header, Content, Sider, Footer ,AudioOutlined } = Layout;


const { SubMenu } = Menu;

const toggleCollapsed = () => {
  this.setState({
    collapsed: !this.state.collapsed,
  });
};

const suffix = (
    <AudioOutlined
        style={{
          fontSize: 16,
          color: '#1890ff',
        }}
    />
);
function App(){
    const [collapsed, setCollapse] = useState(false)
  return (
      <Router>
      <div className="App">
          <Layout>
              <Header style={{ position: 'fixed', zIndex: 1, width: '100%', display: "flex",
                  alignItems: "center", justifyContent: "space-between"}}>
                  <div style={{display: 'flex'}}>
                      <MenuUnfoldOutlined style={{color: 'white'}} onClick={() => setCollapse(!collapsed)}/>
                      <Title style={{color: 'white'}} level={1}>Flint</Title>
                  </div>
                  <div className="search1">
                  <Search
                      placeholder="search"
                      onSearch={value => console.log(value)}
                      style= {{ width: 300 }}
                  />
                  </div>
                  <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                      {/*{props.user ? <Menu.Item key="1" >nav 1</Menu.Item> : <Menu/>}*/}
                      <Menu.Item onClick={Login} icon={<LoginOutlined />}key="1">Login</Menu.Item>
                      <Menu.Item icon={<UserAddOutlined />} key="2">Registration</Menu.Item>
                  </Menu>
              </Header>
              <Layout>
                  <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth="0" >
                      <div className="logo" />
                      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                          <Menu.Item key="1" icon={<UserOutlined />}>
                              nav 1
                          </Menu.Item>
                          {/*<Menu.Item key="2" icon={<VideoCameraOutlined />}>*/}
                          {/*    nav 2*/}
                          {/*</Menu.Item>*/}
                          {/*<Menu.Item key="3" icon={<UploadOutlined />}>*/}
                          {/*    nav 3*/}
                          {/*</Menu.Item>*/}
                      </Menu>
                  </Sider>
                  <Content style={{minHeight: "80vh"}}>Content</Content>
              </Layout>
              <Footer>Footer</Footer>
          </Layout>
      </div>
          <main className="main">
            <div className="content">
                <Route path="/registration" component ={Registration} />
                <Route path="/login" component ={Login} />
              </div>
          </main>
      </Router>
  );
}

export default App;
