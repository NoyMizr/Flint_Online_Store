import React, {useState} from 'react';
import logo from '../logo.svg';
import '../App.css';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {Layout, Menu, Breadcrumb, Button, PageHeader, Input, AutoComplete, Dropdown} from 'antd';
import Title from 'antd/lib/typography/Title';
import {DownOutlined,LogoutOutlined} from "@ant-design/icons";
import Product from "./Product";

function Category({name}) {
    const [products, setProducts] = useState([]);

    const getCategoryProducts = () => {
        fetch("http://localhost:3001/category/" + name).then(res => setProducts(res.data))
    }
    return (
        products.map((product, id) => <Product name={product.name} rate={product.rate}/>)
    )

}
// <Dropdown overlay={Menu}>
//     <Button>
//         Button ,M,.M,.SA <DownOutlined />
//     </Button>
// </Dropdown>