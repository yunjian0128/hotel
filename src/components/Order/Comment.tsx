import React from "react";
import "@/assets/css/order-info.css";

const Component = () => {
    // 接收跳转参数
    const [searchParams] = React.Router.useSearchParams();

    let [orderid, SetID] = React.useState(
        searchParams.get("orderid") ? searchParams.get("orderid") : 0
    );

    let [order, SetOrder] = React.useState({
        price: "",
        starttime_text: "",
        endtime_text: "",
        startday_text: "",
        endday_text: "",
        order_day: "",
        status: "",
        rate: 5,
        comment: "",
        id: 0,
        room: {
            thumb_text: "",
            flag_text: [],
            name: "",
            id: 0,
        },
    });

    // 表单默认值
    let [data, SetData] = React.useState({
        rate: 5,
        comment: "",
    });

    // 当进入页面的时候，请求数据
    React.useEffect(() => {
        OrderData();
    }, []);

    // React.useRef(() => {
    //     SetData({
    //         rate: order.rate,
    //         comment: order.comment,
    //     });
    // });
    // 订单数据发生变化，重新设定表单默认值
    // React.useEffect(() => {
    //     SetData({
    //         rate: order.rate,
    //         comment: order.comment,
    //     });
    // }, [order]);

    // React.useEffect(() => {}, [data]);

    // 请求详情
    const OrderData = async () => {
        var data = {
            busid: React.Business.id,
            orderid: orderid,
        };

        var result = await React.HTTP.post("/order/info", data);

        if (result.code == 0) {
            React.error(result.msg);
            return false;
        }

        SetOrder(result.data.order);
    };

    const finish = async (value: any) => {
        value.orderid = orderid;
        value.busid = React.Business.id;

        var result = await React.HTTP.post("/order/comment", value);

        if (result.code == 0) {
            React.error(result.msg, () => {});
        } else {
            React.success(result.msg);
        }
    };

    return (
        <>
            <React.UI.NavBar back="返回" onBack={React.back}>
                订单评价
            </React.UI.NavBar>

            <div className="order_info">
                {order.status == "3" ? (
                    <React.UI.Form
                        name="form"
                        layout="horizontal"
                        initialValues={order}
                        mode="card"
                        onFinish={finish}
                        footer={
                            <React.UI.Button
                                block
                                type="submit"
                                color="primary"
                                size="large"
                            >
                                提交评论
                            </React.UI.Button>
                        }
                    >
                        <React.UI.Form.Item
                            name="rate"
                            label="评分"
                            rules={[{ required: true }]}
                        >
                            <React.UI.Rate allowHalf />
                        </React.UI.Form.Item>

                        <React.UI.Form.Item
                            name="comment"
                            label="内容"
                            rules={[{ required: true }]}
                        >
                            <React.UI.TextArea
                                placeholder="请输入内容"
                                maxLength={100}
                                rows={2}
                                showCount
                            />
                        </React.UI.Form.Item>
                    </React.UI.Form>
                ) : (
                    <React.UI.Form
                        name="form"
                        layout="horizontal"
                        mode="card"
                        onFinish={finish}
                        initialValues={order}
                        disabled
                    >
                        <React.UI.Form.Item
                            label="评分"
                            rules={[{ required: true }]}
                        >
                            <React.UI.Rate allowHalf value={order.rate} />
                        </React.UI.Form.Item>

                        <React.UI.Form.Item
                            label="内容"
                            rules={[{ required: true }]}
                        >
                            <React.UI.TextArea
                                placeholder="请输入内容"
                                maxLength={100}
                                rows={2}
                                showCount
                                value={order.comment}
                            />
                        </React.UI.Form.Item>
                    </React.UI.Form>
                )}

                <React.UI.Form mode="card">
                    <div
                        className="info_footer"
                        onClick={() =>
                            React.navigate(`/room/info?rid=${order.room.id}`)
                        }
                    >
                        <div className="content_title">房型信息：</div>
                        <div className="detail">
                            <div className="thumb">
                                <img src={order.room.thumb_text} alt="" />
                            </div>
                            <div className="right">
                                <p>{order.room.name}</p>
                                <div className="tips">
                                    {order.room.flag_text &&
                                        order.room.flag_text.map(
                                            (flag: any, index: any) => (
                                                <span
                                                    style={{
                                                        marginRight: "0.5em",
                                                    }}
                                                    key={index}
                                                >
                                                    {flag}
                                                </span>
                                            )
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </React.UI.Form>
            </div>
        </>
    );
};

export default Component;
