import React, {useState} from 'react';
import 'antd/dist/antd.css'
import { Form, Input, Button, notification} from 'antd';
import Title from "antd/lib/typography/Title";
import { Redirect } from 'react-router-dom';


const Login = (props) => {
    const [form] = Form.useForm();
    const [redirect, setRedirect] = useState(false);
    const [requiredMark, setRequiredMarkType] = useState('optional');

    const onRequiredTypeChange = ({requiredMark}) => {
        setRequiredMarkType(requiredMark);
    };

    const onLogin = values => {
        fetch('http://localhost:3001/login', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: values.email,
                password: values.password
            }),
        })
            .then(response => response.json())
            .then(user => {props.setUser(user);
            setRedirect(true)})
            .catch(error => notification.error({message:'Error In Logging In: ' + error}));
    };

    return (
        <div className="log">
            {redirect ? <Redirect push to="/"/> : ""}
        <header> <Title style={{color: 'BLACK'}} level={2}>Login</Title>
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                requiredMark,
            }}
            onFinish={onLogin}
            onValuesChange={onRequiredTypeChange}
            requiredMark={requiredMark}>

            <Form.Item label="Email" name="email" required>
                <Input type="email" name="email" id="email" style={{}} placeholder="" />
            </Form.Item>
            <Form.Item label="Password" name="password" required>
                <Input type="password" id="password" name="password" placeholder="" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Login</Button>
                <Title style={{color: 'BLACK'}} level={1}></Title>
                <Title style={{color: 'BLACK'}} level={1}></Title>
                <Title style={{color: 'BLACK'}} level={5}>New to Flint?</Title>
                <div className="site-button-ghost-wrapper">
                <Button  type="primary" ghost onClick={() => window.location.href='/register'}>
                    Create your Flint account
                </Button>
                </div>
            </Form.Item>
        </Form>
        </header>
        </div>
    );
};
export default Login;
