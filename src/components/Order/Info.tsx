import React from "react";
import "@/assets/css/order-info.css";

const Component = () => {
    //接收跳转参数
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
        id: 0,
        room: {
            thumb_text: "",
            flag_text: [],
            name: "",
            id: 0,
        },
    });

    let [guest, SetGuest] = React.useState({
        nickname: "",
        mobile: "",
    });

    React.useEffect(() => {
        OrderData();
    }, []);

    //请求详情
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
        SetGuest(result.data.guest);
    };

    const Comment = () => {
        if (order.status == "3") {
            return (
                <div className="info_title">
                    <h3>待评价</h3>
                    <p>感谢您的光临，请给我们打个分吧</p>
                    <button
                        className="info_rate"
                        onClick={() =>
                            React.navigate(`/order/comment?orderid=${order.id}`)
                        }
                    >
                        立即评价
                    </button>
                </div>
            );
        } else {
            return <></>;
        }
    };

    return (
        <>
            <React.UI.NavBar
                style={{ background: `rgb(55, 68, 134)`, color: "#fff" }}
                back="返回"
                onBack={React.back}
            >
                订单详情
            </React.UI.NavBar>

            <div className="order_info">
                {Comment()}

                <div className="info_content">
                    <div className="content_title">订单信息：</div>
                    <div className="content_item">
                        <p>订单金额</p>
                        <div className="content_price">￥{order.price}</div>
                    </div>
                    <div className="content_item">
                        <p>开始时间</p>
                        <div>
                            {order.starttime_text}({order.startday_text})
                        </div>
                    </div>
                    <div className="content_item">
                        <p>结束时间</p>
                        <div>
                            {order.endtime_text}({order.endday_text})
                        </div>
                    </div>
                    <div className="content_item">
                        <p>入住时间</p>
                        <div style={{ width: "80%", textAlign: "right" }}>
                            {order.starttime_text} - {order.endtime_text} <br />
                            共 {order.order_day} 晚
                        </div>
                    </div>
                    <div className="content_item">
                        <p>入住人</p>
                        <div>{guest.nickname}</div>
                    </div>
                    <div className="content_item">
                        <p>联系电话</p>
                        <div>{guest.mobile}</div>
                    </div>
                </div>
                <div
                    className="info_footer"
                    onClick={() =>
                        React.navigate(`/room/info?rid=${order.room.id}`)
                    }
                >
                    <div className="content_title">房间信息：</div>
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
            </div>
        </>
    );
};

export default Component;
