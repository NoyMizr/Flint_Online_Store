import React, {useState} from 'react';
import logo from '../logo.svg';
import '../App.css';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Button, PageHeader, Input, AutoComplete } from 'antd';
import Title from 'antd/lib/typography/Title';

function Category(props) {
    const [isLog, setLog] = useState(false);
    const [category, setcategory]=useState('');

}