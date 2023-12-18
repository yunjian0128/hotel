import React from "react";

const Component = () => {
    // 添加住客
    const add = async (values: any) => {
        // 组装数据
        values.busid = React.Business.id;

        var result = await React.HTTP.post("guest/add", values);

        if (result.code == 0) {
            React.error(result.msg, () => {});
            return false;
        }

        React.success(result.msg, () => {
            React.back();
            return false;
        });
    };

    return (
        <>
            {/* 导航栏 */}
            <React.UI.NavBar back="返回" onBack={React.back}>
                添加住客
            </React.UI.NavBar>

            {/* 表单 */}
            <React.UI.Form
                initialValues={{ mobile: "", nickname: "" }}
                onFinish={add}
                style={{
                    margin: 10,
                }}
                name="add"
                mode="card"
                footer={
                    <React.UI.Button
                        block
                        type="submit"
                        color="primary"
                        size="large"
                    >
                        提交
                    </React.UI.Button>
                }
            >
                <React.UI.Form.Item
                    name="nickname"
                    label="昵称"
                    rules={[{ required: true }]}
                >
                    <React.UI.Input placeholder="请输入昵称" />
                </React.UI.Form.Item>

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
                    name="gender"
                    label="性别"
                    rules={[{ required: true }]}
                >
                    <React.UI.Radio.Group>
                        <React.UI.Space direction="vertical">
                            <React.UI.Radio value="0">女</React.UI.Radio>
                            <React.UI.Radio value="1">男</React.UI.Radio>
                        </React.UI.Space>
                    </React.UI.Radio.Group>
                </React.UI.Form.Item>
            </React.UI.Form>
        </>
    );
};

export default Component;
