import React from "react";
import LoginAndRegistor from "components/loginAndRegistor";
import { Button, Checkbox, Form, Input } from "antd";
import { publicRequest } from "utils/axiosCall";
import Swal from "sweetalert2";
import Layout from "components/mainLayout";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "libs/redux/userReducer";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        const data = res.data;
        const expiryDate = new Date(data.exp);
        const expUnix = Math.floor(expiryDate.getTime() / 1000);
        data.exp = expUnix;
        dispatch(setUser(data));
        if (value.remember) {
          Cookies.set("accessToken", data.token, {
            expires: expiryDate,
            secure: true,
            sameSite: "Strict",
          });
        } else {
          sessionStorage.setItem("accessToken", data.token);
        }
        form.resetFields();
        navigate("/")
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
