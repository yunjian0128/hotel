import React from "react";
import "@/assets/css/login.css";

const Login = () => {
    // 实例化钩子函数
    const navigate = React.Router.useNavigate();

    const login = async (values: any) => {
        var result: any = await React.HTTP.post("/business/login", values);

        if (result.code) {
            React.UI.Toast.show({
                icon: "success",
                content: result.msg,
                afterClose: () => {
                    React.Cookie.save("business", result.data);
                    navigate("/business/index");
                    return false;
                },
            });
        } else {
            React.UI.Toast.show({
                icon: "fail",
                content: result.msg,
            });

            return false;
        }
    };

    return (
        <div className="login">
            <React.Router.Link
                to="/"
                style={{
                    width: "100%",
                    textAlign: "left",
                    display: "block",
                    fontSize: "1em",
                }}
            >
                &lt;&lt; 去首页
            </React.Router.Link>
            {/* 圆形头像框 */}
            <div
                className="login_img"
                style={{
                    width: "8em",
                    height: "8em",
                    margin: "4em auto",
                }}
            >
                <img
                    src="./assets/images/avatar.png"
                    alt=""
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                    }}
                />
            </div>

            <React.UI.Form
                initialValues={{ mobile: "", password: "" }}
                onFinish={login}
                name="login"
                footer={
                    <React.UI.Button
                        block
                        type="submit"
                        color="primary"
                        size="large"
                    >
                        登录
                    </React.UI.Button>
                }
            >
                <React.UI.Form.Item
                    name="mobile"
                    label="手机号"
                    rules={[
                        { required: true },
                        {
                            pattern: /^1[3456789]\d{9}$/,
                            message: "手机号格式不对",
                        },
                    ]}
                >
                    <React.UI.Input placeholder="请输入手机号" />
                </React.UI.Form.Item>

                <React.UI.Form.Item
                    name="password"
                    label="密码"
                    rules={[{ required: true }]}
                >
                    <React.UI.Input type="password" placeholder="请输入密码" />
                </React.UI.Form.Item>
            </React.UI.Form>

            <React.Router.Link
                to="/business/register"
                style={{
                    width: "100%",
                    textAlign: "center",
                    display: "block",
                    fontSize: "1em",
                }}
            >
                还没有账号？去注册&gt;&gt;
            </React.Router.Link>
        </div>
    );
};

export default Login;
