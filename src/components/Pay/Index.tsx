import React from "react";
import "@/assets/css/index.css";

const Index = () => {
    // 接收跳转参数
    const [searchParams] = React.Router.useSearchParams();

    const [oid, SetOID] = React.useState(
        searchParams.get("data") ? searchParams.get("data") : 0
    );

    // console.log(oid);

    // 获取用户信息
    const [business, SetBusiness] = React.useState(
        React.Cookie.load("business") ? React.Cookie.load("business") : {}
    );

    // 支付方式
    const [payType, SetPayType] = React.useState(1);

    // 请求详情
    const payTypeChange = (e: any) => {
        SetPayType(e);
        console.log(e);
    };

    // 确认支付
    const confirmPay = async () => {
        var result = await React.HTTP.post("/business/pay", {
            // oid: React.Params.oid,
            paytype: payType,
        });

        if (result.code == 0) {
            React.error(result.msg);
            return false;
        }

        React.UI.Toast.show({
            icon: "success",
            content: result.msg,
        });

        React.navigate("/order/list");
    };

    React.useEffect(() => {}, []);

    return (
        <>
            {/* 导航 */}
            <React.UI.NavBar back="返回" onBack={React.back}>
                即将支付
            </React.UI.NavBar>
            <React.UI.Form mode="card">
                {/* 单选框 */}
                <React.UI.Radio.Group onChange={payTypeChange} value={payType}>
                    <React.UI.Space
                        direction="vertical"
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <React.UI.Radio value={1}>
                            <React.UI.Image src="./assets/images/logo_weixin.jpg" />
                        </React.UI.Radio>
                        <React.UI.Radio value={2}>
                            <React.UI.Image src="./assets/images/logo_alipay.jpg" />
                        </React.UI.Radio>

                        {/* 确认按钮 */}
                        <React.UI.Button
                            block
                            color="primary"
                            size="large"
                            style={{ marginTop: "20px" }}
                            onClick={() => confirmPay}
                        >
                            确认支付
                        </React.UI.Button>
                    </React.UI.Space>
                </React.UI.Radio.Group>
            </React.UI.Form>
        </>
    );
};

export default Index;
