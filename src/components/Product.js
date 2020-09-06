import React, {useState} from 'react';
import 'antd/dist/antd.css'
import { Layout, Menu, Breadcrumb, Button, PageHeader, Input, AutoComplete, Rate } from 'antd';

import { Space, Card } from 'antd';

function Product({id, name, price, image, rate, category, description}) {

    return (
        <Space direction="vertical">
            <Card type ="text"  id="name" title={name} style={{ width: 300 }}>

                <p>Price:</p>
                <p>Rate: <Rate disabled defaultValue={2} /></p>
                <Button type="primary">Add</Button>
            </Card>
        </Space>

    );
};
export default Product;