import React, {useState, useEffect} from 'react';
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
        fetch("http://localhost:3001/categories/" + name)
            .then(res => res.json())
            .then(data => setProducts(data))
    }
//.map(products=>products.name).sort()
    useEffect(getCategoryProducts, [name]);

    return (
        <section className="category">
            {products.map(product => <Product key={product.id}
                                              id={product.id}
                                              name={product.name}
                                              rating={product.rating}
                                              price={product.price}
                                              image={product.image}
                                              description={product.description}
            />)}
        </section>
    )
//         <section className="results">
//         {results.map(result =>(
//                 <Result key={result.ImdbID} result={result} openPopup={openPopup}/>
//
//             ))}
// </section>

}
export default Category;