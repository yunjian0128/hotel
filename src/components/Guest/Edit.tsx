import React from "react";

const Component = () => {
    // 接收跳转参数
    const [searchParams] = React.Router.useSearchParams();

    let [id, SetID] = React.useState(
        searchParams.get("id") ? searchParams.get("id") : 0
    );
    let [guest, SetGuest] = React.useState({});

    // 创建一个表单对象
    let [form] = React.UI.Form.useForm();

    React.useEffect(() => {
        GuestData();
    }, []);

    const GuestData = async () => {
        var result = await React.HTTP.post("guest/info", {
            id: id,
            busid: React.Business.id,
        });

        if (result.code == 0) {
            React.error(result.msg);
            return false;
        }

        SetGuest(result.data);

        // 重置一下表单的初始化数据
        form.setFieldsValue(result.data);
    };

    const edit = async (values: any) => {
        // 组装数据
        values.busid = React.Business.id;
        values.id = id;

        var result = await React.HTTP.post("guest/edit", values);

        if (result.code == 0) {
            React.error(result.msg, () => {});
            return false;
        } else {
            React.success(result.msg);
            return false;
        }
    };

    return (
        <>
            <React.UI.NavBar back="返回" onBack={React.back}>
                编辑住客
            </React.UI.NavBar>

            <React.UI.Form
                form={form}
                initialValues={guest}
                onFinish={edit}
                name="edit"
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
                style={{ margin: 10 }}
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
