import React from "react";
import { AddOutline } from "antd-mobile-icons";

const Component = () => {
    let [page, SetPage] = React.useState(1);
    let [list, SetList] = React.useState([]);
    let [hasMore, SethasMore] = React.useState(true);
    let ref = React.useRef(null);

    // 下拉刷新
    const onRefresh = async () => {
        SetPage(1);
        SetList([]);
        SethasMore(true);
        ListData();
    };

    // 上拉加载
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
        };

        var result = await React.HTTP.post("guest/index", data);

        if (result.code == 0) {
            React.error(result.msg, () => {});
            SethasMore(false);
            return false;
        } else {
            SetPage(page + 1);
            SetList(list.concat(result.data));
        }
    };

    const ClickGuest = async (gid: any) => {
        var result = await React.UI.Dialog.confirm({
            title: "删除提醒",
            content: "是否确认删除该住客信息？",
        });

        if (!result) return false;

        var delresult = await React.HTTP.post("guest/del", {
            id: gid,
            busid: React.Business.id,
        });

        if (delresult.code == 0) {
            React.error(delresult.msg, () => {});
            return false;
        } else {
            React.success(delresult.msg, () => {});
            onRefresh();
            return false;
        }
    };

    // 封装右侧滑动的按钮数据
    const right = [
        {
            key: "delete",
            text: "删除信息",
            color: "danger",
        },
    ];

    return (
        <>
            <React.UI.NavBar
                back="返回"
                right={
                    <AddOutline
                        fontSize={30}
                        onClick={() => React.navigate("guest/add")}
                    />
                }
                onBack={React.back}
            >
                住客列表
            </React.UI.NavBar>
            <React.UI.Form mode="card">
                <React.UI.PullToRefresh onRefresh={onRefresh}>
                    <React.UI.List style={{}}>
                        {list.map((item: any, key) => (
                            <React.UI.SwipeAction
                                ref={ref}
                                key={key}
                                rightActions={right}
                                onAction={ClickGuest.bind(this, item.id)}
                            >
                                <React.UI.List.Item
                                    key={key}
                                    description={"联系电话：" + item.mobile}
                                    extra={
                                        <React.UI.Button
                                            color="primary"
                                            size="small"
                                            onClick={() =>
                                                React.navigate(
                                                    `guest/edit?id=${item.id}`
                                                )
                                            }
                                        >
                                            编辑
                                        </React.UI.Button>
                                    }
                                >
                                    昵称：{item.nickname}
                                    <br />
                                    <span
                                        style={{
                                            fontSize: "14px",
                                            color: "gray",
                                        }}
                                    >
                                        性别：{item.gender_text}
                                    </span>
                                </React.UI.List.Item>
                            </React.UI.SwipeAction>
                        ))}
                    </React.UI.List>

                    <React.UI.InfiniteScroll
                        loadMore={loadMore}
                        hasMore={hasMore}
                        threshold={0}
                    />
                </React.UI.PullToRefresh>
            </React.UI.Form>
        </>
    );
};

export default Component;
