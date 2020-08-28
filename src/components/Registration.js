import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import 'antd/dist/antd.css'
import { Form, Input, Button} from 'antd';
import Title from "antd/lib/typography/Title";


const Registration = (props) => {
    const [form] = Form.useForm();


    const onFieldsChanged = values => {
        console.log("values:")
        console.log(values)
    }


    return (
        <Router>
        <div className="log">
            <header> <Title style={{color: 'BLACK'}} level={2}>Creat your Flint account</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFieldsChanged}
                    requiredMark={false}
                >

                    <Form.Item label="Name" name="name" rules={[
                        {
                            required: true,
                            message: 'Please input your name!',
                        },
                    ]}>
                        <Input type="text" name="name" id="name" style={{}} placeholder="" />
                    </Form.Item>

                    <Form.Item label="Email" name="email" rules={[
                        {
                            required: true,
                            message: 'Please input your email!',
                        },
                    ]}>
                        <Input type="email" id="email" style={{}} placeholder="" />
                    </Form.Item>

                    <Form.Item label="Re-Email" required name="reemail"  rules={[
                        {
                            required: true,
                            message: 'Please confirm your email!',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('email') === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject('The two emails that you entered do not match!');
                            },
                        }),
                    ]}>
                        <Input type="email" id="remail" style={{}} placeholder="" />
                    </Form.Item>

                    <Form.Item label="Password" name="password" rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}>
                        <Input type="password" id="password" placeholder="" />
                    </Form.Item>

                    <Form.Item label="Re-Password" required name="repassword" rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                    ]}>
                            <Input type="password" id="rpassword" placeholder="" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Registration</Button>
                    </Form.Item>
                </Form>
            </header>
        </div>
        </Router>
    );
};
export default Registration;
