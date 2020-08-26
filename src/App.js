import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css'
import { Layout, Menu, Breadcrumb, Button, PageHeader} from 'antd';
import Title from 'antd/lib/typography/Title'


import { UserOutlined, LaptopOutlined, NotificationOutlined, AlignLeftOutlined ,LoginOutlined,UserAddOutlined,ShoppingCartOutlined, DingtalkOutlined } from '@ant-design/icons';

const { Header, Content, Sider, Footer, Input ,AudioOutlined } = Layout;


const { SubMenu } = Menu;

const toggleCollapsed = () => {
  this.setState({
    collapsed: !this.state.collapsed,
  });
};
// const { Search } = Input;

const suffix = (
    <AudioOutlined
        style={{
          fontSize: 16,
          color: '#1890ff',
        }}
    />
);
function App(){
  return (
      <div className="App">
        <Layout>
          <Header className="header"  style={{padding:10}} >

            <Title style={{color:'white'}} level={2}>Flint</Title>
          </Header>
            <div className="logo" />
            <Menu className="logok" theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
              <Menu.Item c key="2" icon={<LoginOutlined /> }>Login</Menu.Item>
              <Menu.Item key="1" icon={<UserAddOutlined />} >registration</Menu.Item>
            </Menu>
          <Layout >
            <Sider width={200} className="site-layout-background">
              <Menu
                  mode="inline"
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  style={{ height: '100%', borderRight: 0 }}
              >
                <SubMenu key="sub1" icon={<AlignLeftOutlined />} title="Catgories">
                  <Menu.Item key="1">Eating and drinking equipment</Menu.Item>
                  <Menu.Item key="2">Clothing</Menu.Item>
                  <Menu.Item key="3">Sleeping and Shading</Menu.Item>
                  <Menu.Item key="4">Storage</Menu.Item>
                <Menu.Item key="4">General</Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
              <Content
                  className="site-layout-background"
                  style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                  }}
              >
                Content
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
  );
}

export default App;
