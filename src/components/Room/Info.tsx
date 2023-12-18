import React from "react";
// import ShareModel from "../Common/ShareModel";
import "@/assets/css/detail.css";

// 引入地图组件
import { TMap, InfoWindow } from "@map-component/react-tmap";

const Component = () => {
    // 接收跳转参数
    const [searchParams] = React.Router.useSearchParams();

    let [rid, SetRID] = React.useState(
        searchParams.get("rid") ? searchParams.get("rid") : 0
    );

    let [room, SetRoom] = React.useState({
        name: "",
        price: "",
        state: "",
        thumbs_text: [],
        flag_text: [],
        content: "",
        total: 0,
    });

    // 评论列表
    const [comment, SetComment] = React.useState([
        {
            commenttime_text: "",
            comment: "",
            business: [
                {
                    nickname: "",
                    avatar_text: "",
                },
            ],
        },
    ]);

    const [visible, setVisible] = React.useState(true);
    const [open, SetOpen] = React.useState(false);

    const onClose = () => {
        setVisible(false);
    };

    React.useEffect(() => {
        RoomData();
        CommentData();
    }, []);

    // 请求详情
    const RoomData = async () => {
        var result = await React.HTTP.post("/room/info", { rid });

        if (result.code == 0) {
            React.error(result.msg);
            return false;
        }

        SetRoom(result.data);
    };
    // 定义一个模块

    // 点击分享
    const onShare = () => {
        SetOpen(true);
        console.log("分享");
    };

    // 请求评论
    const CommentData = async () => {
        var result = await React.HTTP.post("/room/comment", { rid });

        if (result.code == 0) {
            // 设置comment为空数组
            SetComment([]);
            return false;
        }

        SetComment(result.data);
    };

    const confirm = () => {
        if (!React.Business.id) {
            React.error("请先登录", () => {});
            return false;
        }

        React.navigate(`room/confirm?rid=${rid}`);
    };

    // 评论列表
    const CommentItems = comment.map((item: any, key) => {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 0",
                    height: "60",
                    width: "100%",
                }}
                key={key}
            >
                <div>
                    <React.UI.Image
                        src={item.business.avatar_text}
                        width={60}
                        height={60}
                        fit="cover"
                        style={{ borderRadius: "50%" }}
                    />
                </div>
                <div
                    style={{
                        marginLeft: "0.5em",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "space-between",
                        }}
                    >
                        <div style={{ fontSize: "1em", color: "gray" }}>
                            {item.business.nickname}
                        </div>
                        <div style={{ fontSize: "1em", color: "gray" }}>
                            {item.commenttime_text}
                        </div>
                    </div>
                    <React.UI.Rate
                        allowHalf
                        value={item.rate}
                        disabled
                        size="small"
                        style={{
                            "--star-size": "12px",
                        }}
                    />
                    <div style={{ fontSize: "1.2em" }}>{item.comment}</div>
                </div>
            </div>
        );
    });

    // 房间图片
    const RoomItem = room.thumbs_text.map((item: any, key) => {
        return (
            <React.UI.Swiper.Item key={key}>
                <React.UI.Image
                    src={item}
                    width={"100%"}
                    fit="fill"
                    onClick={() => setVisible(true)}
                />
            </React.UI.Swiper.Item>
        );
    });

    return (
        <>
            {/* 分享模块 */}
            {/* <ShareModel /> */}
            <React.UI.NavBar back="返回" onBack={React.back}>
                {room.name}
            </React.UI.NavBar>

            {/* 酒店图片轮播图 */}
            <React.UI.Swiper autoplay interval={3000} loop>
                {RoomItem}
            </React.UI.Swiper>

            <div className="detail_top">
                <div id="intro" className="intro">
                    <div className="title">{room.name}</div>
                    <div className="betwee">
                        <div className="left">
                            {room.flag_text &&
                                room.flag_text.map((flag: any, index: any) => (
                                    <span key={index}>{flag}</span>
                                ))}
                        </div>
                        {/* <div className="right" onClick={onShare}>
                            分享
                        </div> */}
                    </div>
                </div>
                <div className="notesin">
                    <div className="title">房型介绍</div>
                    <div className="item">
                        <p
                            className="tips"
                            style={{
                                whiteSpace: "pre-line",
                            }}
                        >
                            {/* 换行 */}
                            {room.content.replace(/\\n/g, "\n")}
                        </p>
                    </div>
                </div>

                <div className="notesin">
                    <div className="title">预订须知</div>
                    <div className="item">
                        <span className="tips">预订房型：</span>
                        <span className="tips">{room.name}</span>
                    </div>
                    <div className="item">
                        <span className="tips">入离时间：</span>
                        <span className="tips">15:00 后入住，12:00 前退房</span>
                    </div>
                    <div className="item">
                        <span className="tips">房间数量：</span>
                        <span className="tips">{room.total}</span>
                    </div>
                </div>

                <div id="comment" className="comment">
                    <div className="title">评价</div>
                    {comment.length > 0 ? (
                        <div>{CommentItems}</div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "20px 0" }}>
                            该房间暂无评论
                        </div>
                    )}
                </div>

                <div className="comment">
                    <div className="title">地图路线</div>
                    <TMap
                        mapKey="TDKBZ-JVFWL-ZXXPY-MXR7M-F74BQ-GEBEI"
                        version="1.exp"
                        center={{ lat: 39.984104, lng: 116.307503 }}
                    />
                </div>
            </div>

            <div className="foot-bar">
                <div className="price">￥{room.price}</div>
                <React.UI.Button
                    onClick={confirm}
                    color="primary"
                    disabled={room.state ? false : true}
                >
                    立即预定
                </React.UI.Button>
            </div>
        </>
    );
};

export default Component;
