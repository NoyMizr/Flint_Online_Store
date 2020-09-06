import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import 'antd/dist/antd.css';

import { Table, Tag, Space ,InputNumber} from 'antd';


function ShoppingCart() {
    const columns = [
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        // {
        //     title: 'Tags',
        //     key: 'tags',
        //     dataIndex: 'tags',
        //     render: tags => (
        //         <>
        //             {tags.map(tag => {
        //                 let color = tag.length > 5 ? 'geekblue' : 'green';
        //                 if (tag === 'loser') {
        //                     color = 'volcano';
        //                 }
        //                 return (
        //                     <Tag color={color} key={tag}>
        //                         {tag.toUpperCase()}
        //                     </Tag>
        //                 );
        //             })}
        //         </>
        //     ),
        // },
//     {
//         title: 'Action',
//         key: 'action',
//         render: (text, record) => (
//             <Space size="middle">
//                 <a>Invite {record.name}</a>
//                 <a>Delete</a>
//             </Space>
//         ),
//     },
    ];

    const data = [
        {
            product: 'Tent',
            description: 'mklnlknlnlknlknlnkln',
            price: '50 dollar',

        }
        // {
        //     key: '1',
        //     name: 'John Brown',
        //     age: 32,
        //     address: 'New York No. 1 Lake Park',
        //     tags: ['nice', 'developer'],
        // },
        // {
        //     key: '2',
        //     name: 'Jim Green',
        //     age: 42,
        //     address: 'London No. 1 Lake Park',
        //     tags: ['loser'],
        // },
        // {
        //     key: '3',
        //     name: 'Joe Black',
        //     age: 32,
        //     address: 'Sidney No. 1 Lake Park',
        //     tags: ['cool', 'teacher'],
        // },
    ];
};
export default ShoppingCart;
