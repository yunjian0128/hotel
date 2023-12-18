import React from "react";

// 引入地图组件
import { TMap, InfoWindow } from "@map-component/react-tmap";

const Component = () => {
    return (
        <>
            <React.UI.NavBar back="返回" onBack={React.back}>
                关于我们
            </React.UI.NavBar>

            <React.UI.Form mode="card">
                <React.UI.Form.Item label="项目名称">
                    <React.UI.Input value="如枫酒店预约系统" disabled />
                </React.UI.Form.Item>
                <React.UI.Form.Item label="电子邮箱">
                    <React.UI.Input value="2054075682@qq.com" disabled />
                </React.UI.Form.Item>
                <React.UI.Form.Item label="使命与愿景">
                    <React.UI.TextArea
                        cols={30}
                        rows={4}
                        value="我们的使命是通过技术的创新和卓越的服务，为用户提供无缝的酒店预约体验。我们梦想着成为行业领先者，引领酒店预约的未来。"
                        disabled
                    />
                </React.UI.Form.Item>
                <React.UI.Form.Item label="反馈渠道">
                    <React.UI.TextArea
                        cols={30}
                        rows={2}
                        value="我们欢迎用户的反馈，您可以通过发送邮件至上面的电子邮箱联系我们。"
                        disabled
                    />
                </React.UI.Form.Item>
                <React.UI.Form.Item label="版权信息">
                    <React.UI.TextArea
                        value="本项目由个人开发，版权所有©2023 YUNJIAN"
                        disabled
                    />
                </React.UI.Form.Item>
                <React.UI.Form.Item label="也欢迎您线下与我们取得联系"></React.UI.Form.Item>
                <TMap
                    width="100%"
                    height="300px"
                    mapKey="TDKBZ-JVFWL-ZXXPY-MXR7M-F74BQ-GEBEI"
                    version="1.exp"
                    center={{ lat: 39.984104, lng: 116.307503 }}
                />
            </React.UI.Form>
        </>
    );
};

export default Component;
