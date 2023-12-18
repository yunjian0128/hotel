import React from "react";
import Menu from "@/components/Common/Menu";
import "@/assets/css/user.css";

const Index = () => {
    // 实例化钩子函数
    const navigate = React.Router.useNavigate();

    // 获取用户信息
    const [business, SetBusiness] = React.useState(
        React.Cookie.load("business") ? React.Cookie.load("business") : {}
    );

    // 退出登录
    const logout = async () => {
        var result: any = await React.UI.Dialog.confirm({
            title: "退出提示",
            content: "确定要退出登录吗？",
        });

        if (result) {
            // 删除cookie
            React.Cookie.remove("business");

            // 跳转
            navigate("/");
        }
    };

    let [orderCount, SetOrderCount] = React.useState({
        checkin: 0,
        refund: 0,
        comment: 0,
    });

    // 查询用户的订单数量
    const OrderCount = async () => {
        // 如果没有登录，就不查询
        if (!React.Business.id) {
            return false;
        }

        // 查询订单数量
        var result: any = await React.HTTP.post("/order/count", {
            busid: business.id,
        });

        if (result.code == 1) {
            SetOrderCount(result.data);
        }
    };

    // 一进来就查询订单数量
    React.useEffect(() => {
        OrderCount();
    }, []);

    return (
        <>
            <div className="top">
                <div>个人中心</div>
            </div>
            {/* 头部 */}
            <div className="header">
                <div className="userinfo">
                    <div className="avatar">
                        <img src={business.avatar_text} alt="" />
                    </div>
                    <div className="nickname">{business.nickname}</div>
                    <div className="nickname content">{business.motto}</div>
                </div>
                <div className="corrugated">
                    <div className="wave-top wave-item"></div>
                    <div className="wave-middle wave-item"></div>
                    <div className="wave-bottom wave-item"></div>
                </div>
            </div>
            <div className="menu-center">
                <div className="item">
                    <React.Router.Link
                        to="/order/index?status=1"
                        style={{ color: "#606266" }}
                    >
                        <div>{orderCount.checkin}</div>
                        <div className="text">待入住</div>
                    </React.Router.Link>
                </div>
                <div className="item">
                    <React.Router.Link
                        to="/order/index?status=-1"
                        style={{ color: "#606266" }}
                    >
                        <div>{orderCount.refund}</div>
                        <div className="text">待退款</div>
                    </React.Router.Link>
                </div>
                <div className="item">
                    <React.Router.Link
                        to="/order/index?status=3"
                        style={{ color: "#606266" }}
                    >
                        <div>{orderCount.comment}</div>
                        <div className="text">待评论</div>{" "}
                    </React.Router.Link>
                </div>
            </div>
            <div className="menu-cell">
                <div className="item">
                    <React.Router.Link to="/business/profile">
                        <div className="title">
                            <div className="icon">
                                <img src="/assets/images/profile.png" alt="" />
                            </div>
                            个人资料
                        </div>
                        <div className="icon">
                            <img src="/assets/images/right.png" alt="" />
                        </div>
                    </React.Router.Link>
                </div>
                <div className="item">
                    <React.Router.Link to="/guest/index">
                        <div className="title">
                            <div className="icon">
                                <img src="/assets/images/guest.png" alt="" />
                            </div>
                            住客信息
                        </div>
                        <div className="icon">
                            <img src="/assets/images/right.png" alt="" />
                        </div>
                    </React.Router.Link>
                </div>
                <div className="item">
                    <React.Router.Link to="/order/index">
                        <div className="title">
                            <div className="icon">
                                <img src="/assets/images/order.png" alt="" />
                            </div>
                            房间订单
                        </div>
                        <div className="icon">
                            <img src="/assets/images/right.png" alt="" />
                        </div>
                    </React.Router.Link>
                </div>
                <div className="item">
                    <React.Router.Link to="/collection/index">
                        <div className="title">
                            <div className="icon">
                                <img
                                    src="/assets/images/collection.png"
                                    alt=""
                                />
                            </div>
                            我的收藏
                        </div>
                        <div className="icon">
                            <img src="/assets/images/right.png" alt="" />
                        </div>
                    </React.Router.Link>
                </div>
                <div className="item">
                    <React.Router.Link to="/coupon/index">
                        <div className="title">
                            <div className="icon">
                                <img src="/assets/images/coupon.png" alt="" />
                            </div>
                            我的优惠券
                        </div>
                        <div className="icon">
                            <img src="/assets/images/right.png" alt="" />
                        </div>
                    </React.Router.Link>
                </div>
                <div className="item">
                    <React.Router.Link to="/aboutus/index">
                        <div className="title">
                            <div className="icon">
                                <img
                                    src="/assets/images/contactus.png"
                                    alt=""
                                />
                            </div>
                            关于我们
                        </div>
                        <div className="icon">
                            <img src="/assets/images/right.png" alt="" />
                        </div>
                    </React.Router.Link>
                </div>

                <div className="item" style={{ marginBottom: "50px" }}>
                    <a onClick={logout}>
                        <div className="title">
                            <div className="icon">
                                <img src="/assets/images/logout.png" alt="" />
                            </div>
                            退出登录
                        </div>
                        <div className="icon">
                            <img src="/assets/images/right.png" alt="" />
                        </div>
                    </a>
                </div>
            </div>

            <Menu />
        </>
    );
};

export default Index;
