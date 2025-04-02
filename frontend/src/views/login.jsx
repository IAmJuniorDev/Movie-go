import React from "react";
import LoginAndRegistor from "../components/loginAndRegistor";
import { Button, Checkbox, Form, Input } from "antd";
import { publicRequest } from "../axiosCall";
import Swal from "sweetalert2";
import Layout from "../components/mainLayout";
import Cookies from "js-cookie";

const Login = () => {
  const [form] = Form.useForm();
  const onFinish = async (value) => {
    try {
      const res = await publicRequest.post("/user/login", value);
      if (res && res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back!",
        });
        const token = res.data;
        if (value.remember) {
          Cookies.set("accessToken", token, {
            expires: 15,
            secure: true,
            sameSite: "Strict",
          });
        } else {
          sessionStorage.setItem("accessToken", token);
        }
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
    <Layout>
      <LoginAndRegistor data={"Login"}>
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
          <Form.Item
            name="remember"
            valuePropName="checked"
            label={null}
            className="remember-me"
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item
            name="register"
            style={{ marginBottom: 10, dispaly: "inline" }}
            className="register"
          >
            <p style={{ margin: 0, color: "white", display: "inline-block" }}>
              Don't have username?{"‎ ‎ "}
            </p>
            <a
              href="/package"
              style={{ textDecoration: "underline", display: "inline-block" }}
            >
              Register
            </a>
            <p style={{ margin: 0, color: "white", display: "inline-block" }}>
              {"‎ "}Now!
            </p>
          </Form.Item>
          <Form.Item label={null} className="button">
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </LoginAndRegistor>
    </Layout>
  );
};

export default Login;
