import React from "react";
import { AddOutline } from "antd-mobile-icons";
import "@/assets/css/order.css";

const Component = () => {
    let [page, SetPage] = React.useState(1);
    let [list, SetList] = React.useState([]);
    let [hasMore, SethasMore] = React.useState(true);
    let [status, SetStatus] = React.useState("");

    let statuslist = [
        { name: "全部", value: "" },
        { name: "可使用", value: "1" },
        { name: "不可使用", value: "0" },
    ];

    // 下拉刷新
    const onRefresh = async () => {
        SetPage(1);
        SetList([]);
        SethasMore(true);
        ListData();
    };

    //上拉加载
    const loadMore = async () => {
        // 如果刷新状态已经为true了，就要修改为false
        if (hasMore) {
            SethasMore(false);
        }

        ListData();
    };

    // 请求数据
    const ListData = async () => {
        // 组装数据
        var data = {
            page: page,
            busid: React.Business.id,
            status: status,
        };

        var result = await React.HTTP.post("coupon/business", data);

        if (result.code == 0) {
            React.error(result.msg, () => {});
            SethasMore(false);
            return false;
        } else {
            SetPage(page + 1);
            SetList(list.concat(result.data));
        }
    };

    let TabChange = (status: any) => {
        SetStatus(status);
        onRefresh();
    };

    return (
        <>
            <React.UI.NavBar
                back="返回"
                right={
                    <AddOutline
                        fontSize={30}
                        onClick={() => React.navigate("coupon/list")}
                    />
                }
                onBack={React.back}
            >
                我的优惠券
            </React.UI.NavBar>

            <React.UI.Tabs defaultActiveKey={status} onChange={TabChange}>
                {statuslist.map((item) => (
                    <React.UI.Tabs.Tab title={item.name} key={item.value} />
                ))}
            </React.UI.Tabs>

            <React.UI.PullToRefresh onRefresh={onRefresh}>
                <div className="hotellist">
                    {list.map((item: any, key) => (
                        <div className="item" key={key}>
                            <React.Router.Link
                                to={`/coupon/info?cid=${item.cid}`}
                            >
                                {status == "" ? (
                                    <span
                                        style={{
                                            position: "absolute",
                                            zIndex: 999,
                                            color: "#fa3534",
                                            border: "1px solid #fab6b6",
                                            padding: "6px 11px",
                                            fontSize: 12,
                                            lineHeight: 1,
                                            backgroundColor: "#fef0f0",
                                            borderRadius: 53,
                                            top: 10,
                                            right: 10,
                                        }}
                                    >
                                        {item.status_text}
                                    </span>
                                ) : (
                                    <span></span>
                                )}
                                <div className="images">
                                    <div className="swipers">
                                        <img
                                            src={item.coupon.thumb_text}
                                            alt=""
                                        />
                                    </div>
                                    <div className="title">
                                        {item.coupon.title}
                                    </div>
                                </div>
                            </React.Router.Link>

                            <div>
                                <div className="item_bot">
                                    <div className="font">
                                        <span className="price">
                                            {item.coupon.rate * 10}折
                                        </span>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <div
                                            className="btn"
                                            style={{
                                                backgroundColor: "orange",
                                                marginRight: 10,
                                            }}
                                        >
                                            领取时间：{item.createtime_text}
                                        </div>
                                        <React.Router.Link
                                            to={`/coupon/info?cid=${item.cid}`}
                                        >
                                            <div className="btn">详细信息</div>
                                        </React.Router.Link>
                                    </div>
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
            </React.UI.PullToRefresh>
        </>
    );
};

export default Component;
