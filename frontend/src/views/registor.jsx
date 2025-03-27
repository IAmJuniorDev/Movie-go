import React from "react";
import LoginAndRegistor from "../components/loginAndRegistor";
import { Button, Form, Input } from "antd";
import Swal from "sweetalert2";
import { publicRequest } from "../axiosCall";
import { useLocation } from "react-router-dom";

const Registor = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const { data } = location.state || {};

  const onFinish = async (value) => {
    const currentTime = new Date();
    const expired = new Date(currentTime.getTime() + parseInt(data?.lifeTime) * 24 * 60 * 60 * 1000);
    var Data= {
      username:value.username,
      password:value.password,
      time_stamp:expired
    }
    try {
      const res = await publicRequest.post("/user", Data);
      if (res && res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back!",
        });
        form.resetFields();
      }
    } catch (error) {
      console.error("Login Error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data || "Something went wrong. Please try again.",
      });
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <LoginAndRegistor data={"Registor"}>
      <Form
        form={form}
        className="login-container"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item className="register">
          <span style={{color:"white"}}>
            The package is {data.title} and long {data.lifeTime} days
          </span>
        </Form.Item>
        <Form.Item label={null} className="button">
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </LoginAndRegistor>
  );
};

export default Registor;
