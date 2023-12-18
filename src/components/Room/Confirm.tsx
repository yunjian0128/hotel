import React from "react";
import "@/assets/css/confirm.css";

const Component = () => {
    // 接收跳转参数
    const [searchParams] = React.Router.useSearchParams();
    let [rid, SetRID] = React.useState(
        searchParams.get("rid") ? searchParams.get("rid") : 0
    );

    let [show, SetShow] = React.useState(false);
    let [room, SetRoom] = React.useState({
        name: "",
        price: "0",
        state: "",
        thumb_text: "",
        flag_text: [],
        content: "",
        total: 0,
    });

    let [guest, SetGuest] = React.useState([]);
    let [GuestShow, SetGuestShow] = React.useState(false);

    let [coupon, SetCoupon] = React.useState([]);
    let [CouponShow, SetCouponShow] = React.useState(false);

    let [order, SetOrder] = React.useState({
        busid: React.Business.id,
        roomid: rid,
        guest: "",
        origin_price: room.price,
        price: "",
        starttime: 0,
        endtime: 0,
        couponid: "",
        couponstr: "",
        datestr: "",
        gueststr: "",
        guestids: [],
    });

    let [price, SetPrice] = React.useState(0);
    let [origin_price, SetOriginPrice] = React.useState(0);
    let [day, SetDay] = React.useState(0);

    React.useEffect(() => {
        RoomData();
        GuestData();
        CouponData();
    }, []);

    React.useEffect(() => {
        total();
    }, [order, room]);

    // 请求详情
    const RoomData = async () => {
        var result = await React.HTTP.post("/room/info", { rid });

        if (result.code == 0) {
            React.error(result.msg);
            return false;
        }

        SetRoom(result.data);
    };

    // 当前用户的住客信息
    const GuestData = async () => {
        var result = await React.HTTP.post("room/guest", {
            busid: React.Business.id,
        });

        if (result.code == 0) {
            React.error(result.msg, () => {});
            return false;
        }

        SetGuest(result.data);
    };

    // 获取当前用户优惠券
    const CouponData = async () => {
        var result = await React.HTTP.post("/room/coupon", {
            busid: React.Business.id,
        });

        if (result.code == 1) {
            var list: any = [];
            result.data.map((item: any) => {
                list.push({
                    label: `${item.coupon.title}-${item.coupon.rate * 10}折`,
                    value: item.id,
                    rate: item.coupon.rate,
                });
            });

            list = [list];

            SetCoupon(list);
        }
    };

    // 选择日期
    const DateChange = (val: any) => {
        SetShow(false);

        var datestr = `${new Date(val[0]).toLocaleDateString()} - ${new Date(
            val[1]
        ).toLocaleDateString()}`;

        var starttime = Date.parse(new Date(val[0]).toLocaleString()) / 1000;
        var endtime = Date.parse(new Date(val[1]).toLocaleString()) / 1000;

        SetOrder({
            ...order,
            starttime,
            endtime,
            datestr,
        });
    };

    // 选择住客信息
    const guestChange = (value: string[]) => {
        var gueststr: any = [];
        var guestids: any = [];

        guest.map((item: any) => {
            if (value.includes(item.id)) {
                gueststr.push(item.nickname);
                guestids.push(item.id);
            }
        });

        var str = gueststr.join(",");
        var ids = guestids.join(",");

        SetOrder({
            ...order,
            gueststr: str,
            guest: ids,
            guestids,
        });
    };

    // 选择优惠券
    const CounponConfirm = (value: any) => {
        SetCouponShow(false);

        var couponstr = "";
        var list: any = coupon[0];

        list.map((item: any) => {
            if (item.value == value[0]) {
                couponstr = item.label;
            }
        });

        SetOrder({
            ...order,
            couponstr,
            couponid: value[0],
        });
    };

    // 计算价格
    const total = () => {
        var starttime = order.starttime;
        var endtime = order.endtime;

        // 时间差
        var count: any = endtime - starttime;
        count = count / 86400;
        count = count.toFixed(0);
        count = parseInt(count);

        var origin_price = count * parseFloat(room.price);
        var price = origin_price;

        // 是否有选择优惠券id
        if (order.couponid) {
            var rate = 1;
            var list: any = coupon[0];

            list.map((item: any) => {
                if (item.value == order.couponid) {
                    rate = item.rate;
                }
            });

            price = origin_price * rate;
        }

        SetDay(count);
        SetPrice(price);
        SetOriginPrice(origin_price);
    };

    const confirm = async () => {
        var submit = await React.UI.Dialog.confirm({
            content: "是否确认提交订单",
        });

        if (!submit) {
            return false;
        }

        // 组装数据
        var data = {
            busid: order.busid,
            roomid: order.roomid,
            guest: order.guest,
            starttime: order.starttime,
            endtime: order.endtime,
            couponid: order.couponid ? order.couponid : 0,
        };

        // 跳转到支付页面
        // React.navigate(`/pay/index?data=${JSON.stringify(data)}`);

        // 发送请求
        var result = await React.HTTP.post("/room/add", data);

        if (result.code == 0) {
            React.error(result.msg, () => {});
            return false;
        } else {
            React.success(result.msg, () => {
                React.navigate("/business/index");
            });
        }
    };

    return (
        <>
            <React.UI.NavBar back="返回" onBack={React.back}>
                {room.name}
            </React.UI.NavBar>

            <div className="skeleton">
                <div className="detail">
                    <div className="thumb">
                        <img src={room.thumb_text} alt="" />
                    </div>
                    <div className="right">
                        <p>{room.name}</p>
                        <p>￥{room.price} / 晚</p>
                        <div className="tips">
                            {room.flag_text &&
                                room.flag_text.map((flag: any, index: any) => (
                                    <span key={index}> {flag} </span>
                                ))}
                        </div>
                    </div>
                </div>

                <div className="skeleton_rect">
                    <div className="item">
                        <label>入住日期</label>
                        <React.UI.Input
                            value={order.datestr}
                            type="text"
                            className="item_right"
                            placeholder="请选择入住日期"
                            onClick={() => SetShow(true)}
                        />

                        <React.UI.CalendarPicker
                            visible={show}
                            min={new Date()}
                            selectionMode="range"
                            onClose={() => SetShow(false)}
                            onMaskClick={() => SetShow(false)}
                            onConfirm={DateChange}
                        ></React.UI.CalendarPicker>
                    </div>

                    <div className="item">
                        <label>住客信息</label>
                        <React.UI.Input
                            type="text"
                            value={order.gueststr}
                            className="item_right"
                            placeholder="请选择住客信息"
                            onClick={() => SetGuestShow(true)}
                        />

                        <React.UI.Popup
                            visible={GuestShow}
                            onMaskClick={() => {
                                SetGuestShow(false);
                            }}
                            destroyOnClose
                        >
                            <div
                                style={{
                                    height: "40vh",
                                    overflowY: "scroll",
                                    padding: "20px",
                                }}
                            >
                                <React.UI.CheckList
                                    multiple={true}
                                    onChange={guestChange}
                                    defaultValue={order.guestids}
                                >
                                    {guest &&
                                        guest.map((item: any, key) => (
                                            <React.UI.CheckList.Item
                                                key={key}
                                                value={item.id}
                                            >
                                                {item.nickname}
                                            </React.UI.CheckList.Item>
                                        ))}
                                </React.UI.CheckList>
                            </div>
                            <React.UI.Button
                                color="primary"
                                block
                                style={{ width: "100%" }}
                                onClick={() => SetGuestShow(false)}
                            >
                                确认
                            </React.UI.Button>
                        </React.UI.Popup>
                    </div>
                </div>

                <div className="skeleton_price">
                    <div className="tips">优惠券</div>
                    <p>{order.couponstr}</p>
                    <React.UI.Button
                        size="mini"
                        color="primary"
                        onClick={() => SetCouponShow(true)}
                    >
                        选择
                    </React.UI.Button>
                    <React.UI.Picker
                        columns={coupon}
                        visible={CouponShow}
                        onClose={() => {
                            SetCouponShow(false);
                        }}
                        onConfirm={CounponConfirm}
                    ></React.UI.Picker>
                </div>

                <div className="skeleton_price">
                    <div className="tips">房间费用</div>
                    <div className="prices">
                        <span>￥{price}</span>
                        <span>共 {day} 晚</span>
                    </div>
                </div>
            </div>

            <div className="comfirm_foot-bar">
                <div className="text">
                    <span>总价:</span>
                    <span>￥{price}</span>
                </div>

                <React.UI.Button
                    onClick={confirm}
                    color="primary"
                    disabled={room.state ? false : true}
                >
                    提交订单
                </React.UI.Button>
            </div>
        </>
    );
};

export default Component;
