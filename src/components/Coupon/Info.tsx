import React from "react";
import "@/assets/css/coupon-info.css";

const Component = () => {
    // 接收跳转参数
    const [searchParams] = React.Router.useSearchParams();

    // 设置优惠券id
    let [cid, SetCID] = React.useState(
        searchParams.get("cid") ? searchParams.get("cid") : 0
    );

    // 优惠券详情
    let [coupon, SetCoupon] = React.useState({
        title: "",
        rate: 1,
        total: 0,
        createtime_text: "",
        endtime_text: "",
        thumb_text: "",
        receive: true,
        endtime: 0,
    });

    // 领取记录
    let [receive, SetReceive] = React.useState([]);

    // useEffect的作用是在组件渲染到屏幕之后执行
    React.useEffect(() => {
        // 请求优惠券详情
        CouponData();
    }, []);

    // 倒计时方法 传入结束时间 返回倒计时
    const CountDown = (endtime: number) => {
        // 当前时间
        var now = new Date().getTime();

        // 结束时间
        var end = new Date(endtime * 1000).getTime();

        // 剩余时间
        var lefttime = end - now;

        // 倒计时
        var d = 0,
            h = 0,
            m = 0,
            s = 0;

        // 如果还有时间
        if (lefttime >= 0) {
            d = Math.floor(lefttime / 1000 / 60 / 60 / 24);
            h = Math.floor((lefttime / 1000 / 60 / 60) % 24);
            m = Math.floor((lefttime / 1000 / 60) % 60);
            s = Math.floor((lefttime / 1000) % 60);

            if (d > 0) {
                return `距离优惠券领取结束还有${d}天${h}小时${m}分${s}秒`;
            }
            if (h > 0) {
                return `距离优惠券领取结束还有${h}小时${m}分${s}秒`;
            }
            if (m > 0) {
                return `距离优惠券领取结束还有${m}分${s}秒`;
            }

            if (s > 0) {
                return `距离优惠券领取结束还有${s}秒`;
            }
        } else {
            return "来晚了，优惠券已经被抢光了！";
        }
    };

    const [timeRemaining, setTimeRemaining] = React.useState(
        CountDown(coupon.endtime)
    );

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            const remaining = CountDown(coupon.endtime);
            setTimeRemaining(remaining);

            // 如果倒计时结束，可以清除定时器
            if (remaining === null) {
                clearInterval(intervalId);
            }
        }, 1000);

        // 组件卸载时清除定时器，避免内存泄漏
        return () => clearInterval(intervalId);
    }, [coupon.endtime]);

    // 请求优惠券详情
    const CouponData = async () => {
        // 组装数据
        var data = {
            cid: cid,
            busid: React.Business.id,
        };

        var result = await React.HTTP.post("/coupon/info", data);

        if (result.code == 0) {
            React.error(result.msg);
            return false;
        }

        SetCoupon(result.data.coupon);
        SetReceive(result.data.receive);
    };

    // 领取优惠券
    const CounponReceive = async () => {
        if (!React.Business.id) {
            React.error("请先登录", () => {});
            return false;
        }

        // 组装数据
        var data = {
            cid,
            busid: React.Business.id,
        };

        // 发请求
        var result = await React.HTTP.post("/coupon/receive", data);

        if (result.code == 0) {
            React.error(result.msg, () => {});
        } else {
            CouponData();
            React.success(result.msg, () => {});
        }
    };

    // 通告组件
    const Items = receive.map((item: any, key) => (
        <React.UI.Swiper.Item key={key}>
            <React.UI.NoticeBar
                style={{ border: "0px" }}
                content={`用户：${
                    item.business.nickname ? item.business.nickname : "匿名用户"
                } 在 ${item.createtime_text} 领取了优惠券`}
                color="info"
            />
        </React.UI.Swiper.Item>
    ));

    return (
        <>
            <React.UI.NavBar back="返回" onBack={React.back}>
                {coupon.title}
            </React.UI.NavBar>

            <React.UI.AutoCenter>
                <React.UI.Image
                    src={coupon.thumb_text}
                    width={"100%"}
                    fit="fill"
                />
            </React.UI.AutoCenter>

            <React.UI.Swiper
                autoplay={true}
                autoplayInterval={1000}
                loop={true}
                indicator={() => false}
                direction="vertical"
                style={{ "--height": "40px", border: "0px" }}
            >
                {Items}
            </React.UI.Swiper>

            <div className="coupon_detail">
                <div className="coupon_info">
                    <div className="left">
                        <div className="left_top">
                            <div>
                                <span>{coupon.rate * 10}</span>折
                            </div>
                            <div className="top_info">
                                <div>优惠券</div>
                                <div>COUPON</div>
                            </div>
                        </div>
                    </div>
                    <div className="receive">
                        {coupon.receive ? (
                            <React.UI.Button
                                size="small"
                                disabled
                                color="primary"
                                style={{
                                    marginRight: "10px",
                                    fontSize: "13px",
                                }}
                            >
                                您已领取
                            </React.UI.Button>
                        ) : (
                            <React.UI.Button
                                onClick={CounponReceive}
                                size="small"
                                color="primary"
                            >
                                领取
                            </React.UI.Button>
                        )}
                    </div>
                </div>
                <div className="coupon_prompt">
                    <div className="prompt_title">温馨提示：</div>
                    <div>
                        <span>•</span>
                        领取后 {coupon.createtime_text} 至 {coupon.endtime_text}{" "}
                        有效
                    </div>
                    <div>
                        <span>•</span>仅限量{coupon.total}张，赶快领取！
                    </div>
                    <div>
                        <span>•</span>
                        {timeRemaining}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Component;
