import React from "react";
import "@/assets/css/order.css";

const Component = () => {
    // 接收跳转参数
    const [searchParams] = React.Router.useSearchParams();

    let [status, SetStatus] = React.useState(
        searchParams.get("status") ? searchParams.get("status") : 0
    );
    let [list, SetList] = React.useState([]);
    let [page, SetPage] = React.useState(1);
    let [hasMore, SethasMore] = React.useState(true);

    let statuslist = [
        { name: "全部", value: "" },
        { name: "已支付", value: "1" },
        { name: "已入住", value: "2" },
        { name: "已退房", value: "3" },
        { name: "已评价", value: "4" },
        { name: "申请退款", value: "-1" },
    ];

    //上拉加载
    const loadMore = async () => {
        // 如果刷新状态已经为true了，就要修改为false
        if (hasMore) {
            SethasMore(false);
        }

        ListData();
    };

    // 下拉刷新的方法
    const onRefresh = async () => {
        SetPage(1);
        SetList([]);
        SethasMore(true);
        ListData();
    };

    //请求列表数据
    const ListData = async () => {
        //封装数据
        var data = {
            busid: React.Business.id,
            status: status,
            page: page,
        };

        var result = await React.HTTP.post("/order/index", data);

        if (result.code == 1) {
            SetPage(page + 1);
            SetList(list.concat(result.data));
        } else {
            SethasMore(false);
            return false;
        }
    };

    let TabChange = (status: any) => {
        SetStatus(status);
        onRefresh();
    };

    let refund = async (orderid: any) => {
        var result = await React.UI.Dialog.confirm({
            title: "退款提醒",
            content: "是否确认取消该订单？",
        });

        if (!result) return false;

        var delresult = await React.HTTP.post("order/refund", {
            orderid: orderid,
            busid: React.Business.id,
        });

        if (delresult.code == 0) {
            React.error(delresult.msg, () => {});
            return false;
        }

        React.success(delresult.msg, () => {
            onRefresh();
        });
    };

    return (
        <>
            <React.UI.NavBar back="返回" onBack={React.back}>
                订单列表
            </React.UI.NavBar>

            <React.UI.Tabs defaultActiveKey={status} onChange={TabChange}>
                {statuslist.map((item) => (
                    <React.UI.Tabs.Tab title={item.name} key={item.value} />
                ))}
            </React.UI.Tabs>

            <React.UI.PullToRefresh onRefresh={onRefresh}>
                <div className="order_list">
                    {list.map((item: any, key) => (
                        <div className="item" key={key}>
                            <div className="item_top">
                                <p>{item.room ? item.room.name : ""}</p>
                                <div className="top_tag">
                                    {item.status_text}
                                </div>
                            </div>
                            <div className="house">
                                <div className="item_swipers">
                                    <img src={item.room.thumb_text} alt="" />
                                </div>
                                <div className="item_times">
                                    <div>
                                        <div>{item.starttime_text}</div>
                                        <div>{item.startday_text}</div>
                                    </div>
                                    <div>
                                        <div>共{item.order_day}晚</div>
                                        <div className="item_right">
                                            <img
                                                src="./assets/images/right1.png"
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div>{item.endtime_text}</div>
                                        <div>{item.endday_text}</div>
                                    </div>
                                    <div>
                                        <div className="item_pay">订单总价</div>
                                        <div className="item_price">
                                            ￥{item.price}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item_bar">
                                {item.status == "1" && (
                                    <React.UI.Button
                                        style={{ marginRight: 10 }}
                                        size="small"
                                        color="danger"
                                        onClick={() => refund(item.id)}
                                    >
                                        取消订单
                                    </React.UI.Button>
                                )}

                                {item.status == "3" && (
                                    <React.UI.Button
                                        style={{ marginRight: 10 }}
                                        size="small"
                                        color="success"
                                        onClick={() =>
                                            React.navigate(
                                                `order/comment?orderid=${item.id}`
                                            )
                                        }
                                    >
                                        评价
                                    </React.UI.Button>
                                )}

                                {/* 查看评论 */}
                                {item.status == "4" && (
                                    <React.UI.Button
                                        style={{ marginRight: 10 }}
                                        size="small"
                                        color="success"
                                        onClick={() =>
                                            React.navigate(
                                                `order/comment?orderid=${item.id}`
                                            )
                                        }
                                    >
                                        查看评论
                                    </React.UI.Button>
                                )}

                                <React.UI.Button
                                    size="small"
                                    color="primary"
                                    onClick={() =>
                                        React.navigate(
                                            `/order/info?orderid=${item.id}`
                                        )
                                    }
                                >
                                    订单详情
                                </React.UI.Button>
                            </div>
                        </div>
                    ))}
                </div>
            </React.UI.PullToRefresh>

            <React.UI.InfiniteScroll
                loadMore={loadMore}
                hasMore={hasMore}
                threshold={0}
            />
        </>
    );
};

export default Component;
