import React, {useState} from 'react';
import 'antd/dist/antd.css'
import { Form, Input, Button, Radio ,Typography, Space} from 'antd';
import Title from "antd/lib/typography/Title";
import App from "../App";
import Registration from './Registration'
import { BrowserRouter as Router } from 'react-router-dom';
const { Text, Link } = Typography;



const Login = (props) => {
    const [form] = Form.useForm();
    const [requiredMark, setRequiredMarkType] = useState('optional');

    const onRequiredTypeChange = ({ requiredMark }) => {
        setRequiredMarkType(requiredMark);
    };

    return (
        <div className="log">
        <header> <Title style={{color: 'BLACK'}} level={2}>Login</Title>
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                requiredMark,
            }}
            onValuesChange={onRequiredTypeChange}
            requiredMark={requiredMark}>

            <Form.Item label="Email" required>
                <Input type="email" name="email" id="email" style={{}} placeholder="" />
            </Form.Item>
            <Form.Item label="Password" required>
                <Input type="password" id="password" name="password" placeholder="" />
                <Link href="https://ant.design" target="_blank">
                    <Text underline>Forgot your password?</Text>
                </Link>
            </Form.Item>
            <Form.Item>
                <Button type="primary">Login</Button>
                <Title style={{color: 'BLACK'}} level={1}></Title>
                <Title style={{color: 'BLACK'}} level={1}></Title>
                <Title style={{color: 'BLACK'}} level={5}>New to Flint?</Title>
                <div className="site-button-ghost-wrapper">
                <Button  type="primary" ghost>
                    Creat your Flint account
                </Button>
                </div>
            </Form.Item>
        </Form>
        </header>
        </div>
    );
};
export default Login;
