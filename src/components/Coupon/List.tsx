import React from "react";

const Component = () => {
    let [page, SetPage] = React.useState(1);
    let [list, SetList] = React.useState([]);
    let [hasMore, SethasMore] = React.useState(true);

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
        //组装数据
        var data = {
            page: page,
        };

        var result = await React.HTTP.post("coupon/list", data);

        if (result.code == 0) {
            React.error(result.msg, () => {});
            SethasMore(false);
            return false;
        } else {
            SetPage(page + 1);
            SetList(list.concat(result.data));
        }
    };

    // 领取优惠券
    const CounponReceive = async (cid: any) => {
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
            React.success(result.msg, () => {});
        }
    };

    return (
        <>
            <React.UI.NavBar back="返回" onBack={React.back}>
                优惠券列表
            </React.UI.NavBar>

            <React.UI.PullToRefresh onRefresh={onRefresh}>
                <div className="hotellist">
                    {list.map((item: any, key) => (
                        <div className="item" key={key}>
                            <React.Router.Link
                                to={`/coupon/info?cid=${item.id}`}
                            >
                                <div className="images">
                                    <div className="swipers">
                                        <img src={item.thumb_text} alt="" />
                                    </div>
                                    <div className="title">{item.title}</div>
                                </div>
                            </React.Router.Link>

                            <div>
                                <div className="item_bot">
                                    <div className="font">
                                        <span className="price">
                                            {item.rate * 10}折
                                        </span>
                                    </div>
                                    <div className="font">
                                        <span
                                            className="price"
                                            style={{
                                                fontSize: "15px",
                                                color: "green",
                                            }}
                                        >
                                            仅余 {item.total} 张
                                        </span>
                                    </div>
                                    <div
                                        onClick={() => CounponReceive(item.id)}
                                        className="btn"
                                        style={{
                                            backgroundColor: "orange",
                                        }}
                                    >
                                        立即领取
                                    </div>
                                    <React.Router.Link
                                        to={`/coupon/info?cid=${item.id}`}
                                    >
                                        <div className="btn">详细信息</div>
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
            </React.UI.PullToRefresh>
        </>
    );
};

export default Component;
