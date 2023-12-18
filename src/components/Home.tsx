import React from "react";
import Menu from "@/components/Common/Menu";
import "@/assets/css/index.css";

const Home = () => {
    // 获取用户信息
    const [business, SetBusiness] = React.useState(
        React.Cookie.load("business") ? React.Cookie.load("business") : {}
    );

    let [keywords, SetWords] = React.useState("");
    let [list, SetList] = React.useState([]);
    let [page, SetPage] = React.useState(1);
    let [room, SetRoom] = React.useState([]);
    let [hasMore, SethasMore] = React.useState(true);
    let ref = React.useRef(null);

    React.useEffect(() => {
        CouponData();
    }, []);

    const CouponData = async () => {
        var result = await React.HTTP.post("/coupon/index", {});

        if (result.code == 1) {
            SetList(result.data);
        }
    };

    //优惠券组件
    const CouponItem = list.map((item: any, key) => {
        return (
            <React.UI.Swiper.Item key={key}>
                <React.Router.Link to={`/coupon/info?cid=${item.id}`}>
                    <React.UI.Image
                        src={item.thumb_text}
                        width={"100%"}
                        fit="fill"
                    />
                </React.Router.Link>
            </React.UI.Swiper.Item>
        );
    });

    // 搜索方法
    const search = async (e: any) => {
        // 阻止默认事件
        e.preventDefault();
        onRefresh();
        return false;
    };

    // 下拉刷新的方法
    const onRefresh = async () => {
        SetPage(1);
        SetRoom([]);
        SethasMore(true);
        RoomData();
    };

    // 上拉加载
    const loadMore = async () => {
        // 如果刷新状态已经为true了，就要修改为false
        if (hasMore) {
            SethasMore(false);
        }
        RoomData();
    };

    const RoomData = async () => {
        var result = await React.HTTP.post("/room/index", {
            page,
            keywords,
            busid: business.id,
        });

        if (result.code == 0) {
            SethasMore(false);
            return false;
        } else {
            SetPage(page + 1);
            SetRoom(room.concat(result.data));
        }
    };

    // 收藏
    const collect = async (rid: any, key: number) => {
        if (!business.id) {
            React.error("请先登录", () => {});
            return false;
        }

        // 组装数据
        var data = {
            rid,
            busid: business.id,
        };

        // 发请求
        var result = await React.HTTP.post("/room/collect", data);

        if (result.code == 0) {
            React.error(result.msg, () => {});
        } else {
            React.success(result.msg, () => {});
            onRefresh();
        }
    };

    return (
        <>
            {/* 导航 */}
            <div className="top">
                <div>首页</div>
            </div>

            {/* 轮播图的优惠券 */}
            <React.UI.Swiper autoplay interval={3000} loop>
                {CouponItem}
            </React.UI.Swiper>

            <form className="hotel_search" onSubmit={search.bind(this)}>
                <input
                    type="text"
                    value={keywords}
                    onChange={(e) => {
                        SetWords(e.target.value);
                    }}
                    placeholder="请输入关键词搜索"
                />
                <div className="screen_icon">
                    <img src="./assets/images/ss.png" alt="" />
                </div>
            </form>

            <React.UI.PullToRefresh onRefresh={onRefresh}>
                <div className="hotellist">
                    {room.map((item: any, key) => (
                        <div className="item" key={key}>
                            <div
                                className="collect"
                                onClick={() => collect(item.id, key)}
                            >
                                {item.collect ? (
                                    <img
                                        src="./assets/images/collected.png"
                                        alt=""
                                    />
                                ) : (
                                    <img
                                        src="./assets/images/nocollected.png"
                                        alt=""
                                    />
                                )}
                            </div>
                            <div className="type_name">{item.flag_text[0]}</div>
                            <React.Router.Link to={`/room/info?rid=${item.id}`}>
                                <div className="images">
                                    <div className="swipers">
                                        <img src={item.thumb_text} alt="" />
                                    </div>
                                    <div className="title">{item.name}</div>
                                </div>
                            </React.Router.Link>
                            <div>
                                <div className="item_top">
                                    {item.flag_text &&
                                        item.flag_text.map(
                                            (flag: any, index: any) => (
                                                <span key={index}>{flag}</span>
                                            )
                                        )}
                                </div>

                                <div className="item_bot">
                                    <div className="font">
                                        <span className="price">
                                            ￥{item.price}/晚
                                        </span>
                                    </div>
                                    <React.Router.Link
                                        to={`/room/confirm?rid=${item.id}`}
                                    >
                                        <div className="btn">立即预定</div>
                                    </React.Router.Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <React.UI.InfiniteScroll
                    loadMore={loadMore}
                    hasMore={hasMore}
                    threshold={0}
                />
                {/* 回到顶部 */}
                {/* <React.UI.BackTop /> */}
            </React.UI.PullToRefresh>

            {/* 菜单 */}
            <Menu />
        </>
    );
};

export default Home;
