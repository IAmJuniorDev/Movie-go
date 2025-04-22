import "styles/loginAndRegistor.css";

const LoginAndRegistor = ({ children,data }) => {
  return (
    <div className="login-registor-container">
      <div className="content-container">
        <h1>{data}</h1>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default LoginAndRegistor;
