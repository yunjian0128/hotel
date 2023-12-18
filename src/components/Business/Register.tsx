import React from "react";
import "@/assets/css/login.css";

const Register = () => {
    // 实例化钩子函数
    const navigate = React.Router.useNavigate();

    const register = async (values: any) => {
        var result: any = await React.HTTP.post("/business/register", values);

        if (result.code) {
            React.UI.Toast.show({
                icon: "success",
                content: result.msg,
                afterClose: () => {
                    navigate("/business/login");
                    return false;
                },
            });
        } else {
            if (result.msg == "该号码已注册，可直接登录") {
                React.UI.Toast.show({
                    icon: "fail",
                    content: result.msg,
                    afterClose: () => {
                        navigate("/business/login");
                        return false;
                    },
                });
            }

            React.UI.Toast.show({
                icon: "fail",
                content: "注册失败",
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
                onFinish={register}
                name="register"
                footer={
                    <React.UI.Button
                        block
                        type="submit"
                        color="primary"
                        size="large"
                    >
                        注册
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
                to="/business/login"
                style={{
                    width: "100%",
                    textAlign: "center",
                    display: "block",
                    fontSize: "1em",
                }}
            >
                已有账号？去登录 &gt;&gt;
            </React.Router.Link>
        </div>
    );
};

export default Register;
