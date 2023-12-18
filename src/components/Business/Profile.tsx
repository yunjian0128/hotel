import React from "react";
import AreaPicker from "@/components/Common/AreaPicker";
import { RedoOutline } from "antd-mobile-icons";

const Profile = () => {
    // 创建一个表单对象
    const [form] = React.UI.Form.useForm();

    // 重置表单数据
    const ResetForm = () => {
        form.resetFields();
    };

    // 地区组件的显示与隐藏
    var [area, SetArea] = React.useState(false);

    // 组装表单数据
    var [bus, SetBus] = React.useState({
        nickname: React.Business.nickname,
        mobile: React.Business.mobile,
        password: React.Business.password,
        email: React.Business.email ? React.Business.email : "",
        gender: React.Business.gender,
        avatar: {},
        code: React.Business.district ? React.Business.district : null,
        region_text: React.Business.region_text
            ? React.Business.region_text
            : "",
    });

    // 用户头像
    var [avatar, SetAvatar] = React.useState([
        {
            url: React.Business.avatar_text,
        },
    ]);

    // 删除头像
    const DelAvatar = () => {
        SetAvatar([]);
    };

    // 上传头像
    const upload = async (file: any) => {
        React.Business.avatar = file;

        return {
            url: URL.createObjectURL(file),
        };
    };

    // 设置地区
    const AreaConfirm = (val: any, list: any) => {
        var code = "";

        for (var i = val.length - 1; i >= 0; i--) {
            if (val[i]) {
                code = val[i].toString();
                break;
            }
        }

        var region_text = "";

        if (list[0]) region_text += `${list[0]}`;
        if (list[1]) region_text += `-${list[1]}`;
        if (list[2]) region_text += `-${list[2]}`;

        // 设置表单数据
        form.setFieldsValue({
            code: code,
            region_text: region_text,
        });
    };

    const profile = async (values: any) => {
        // 组装数据
        values.busid = React.Business.id;

        // 头像
        if (React.Business.avatar) {
            values.avatar = React.Business.avatar;
        }

        // 地区
        if (form.getFieldValue("code")) {
            values.code = form.getFieldValue("code");
        }

        // 密码
        if (!values.password) delete values.password;

        // 请求接口
        var result = await React.HTTP.upload("/business/profile", values);

        if (result.code == 0) {
            React.UI.Toast.show({
                icon: "fail",
                content: result.msg,
            });

            return false;
        }

        React.UI.Toast.show({
            icon: "success",
            content: result.msg,
        });

        React.SetBusiness(result.data);
        React.Cookie.save("business", result.data);
        React.navigate(-1);

        // console.log(values);
    };

    return (
        <>
            <React.UI.NavBar
                back="返回"
                onBack={React.back}
                right={<RedoOutline fontSize={25} onClick={ResetForm} />}
            >
                基本资料
            </React.UI.NavBar>

            {/* 地区选择 */}
            <AreaPicker
                visible={area}
                onClose={() => {
                    SetArea(false);
                }}
                onConfirm={AreaConfirm}
            />

            <React.UI.Form
                form={form}
                name="form"
                onFinish={profile}
                layout="horizontal"
                mode="card"
                initialValues={bus}
                footer={
                    <React.UI.Button
                        block
                        type="submit"
                        color="primary"
                        size="large"
                    >
                        提交修改
                    </React.UI.Button>
                }
            >
                {/* 文件上传 */}
                <React.UI.AutoCenter style={{ margin: "30px 0px" }}>
                    <React.UI.ImageUploader
                        value={avatar}
                        maxCount={1}
                        onDelete={DelAvatar}
                        upload={upload}
                        onChange={SetAvatar}
                    />
                </React.UI.AutoCenter>

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

                <React.UI.Form.Item name="password" label="密码">
                    <React.UI.Input type="password" placeholder="请输入密码" />
                </React.UI.Form.Item>

                <React.UI.Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                        { required: true },
                        {
                            pattern:
                                /^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/,
                            message: "邮箱格式不对",
                        },
                    ]}
                >
                    <React.UI.Input placeholder="请输入邮箱" />
                </React.UI.Form.Item>

                <React.UI.Form.Item
                    name="gender"
                    label="性别"
                    rules={[{ required: true }]}
                >
                    <React.UI.Radio.Group>
                        <React.UI.Space direction="vertical">
                            <React.UI.Radio value="0">保密</React.UI.Radio>
                            <React.UI.Radio value="1">男</React.UI.Radio>
                            <React.UI.Radio value="2">女</React.UI.Radio>
                        </React.UI.Space>
                    </React.UI.Radio.Group>
                </React.UI.Form.Item>

                <React.UI.Form.Item
                    name="region_text"
                    label="地区"
                    onClick={() => SetArea(true)}
                >
                    <React.UI.Input placeholder="请选择地区" readonly />
                </React.UI.Form.Item>

                <React.UI.Form.Header />
            </React.UI.Form>
        </>
    );
};

export default Profile;
