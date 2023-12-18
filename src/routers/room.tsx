// 路由模板加载标签
import React from "react";
import Info from "@/components/Room/Info";
import Confirm from "@/components/Room/Confirm";
import Index from "@/components/Room/Index";

// 路由列表
const list = [
    {
        path: "info",
        component: Info,
    },
    {
        path: "confirm",
        component: Confirm,
        auth: true,
    },
    {
        path: "index",
        component: Index,
    },
];

// 父组件结构
const Layout = () => <React.Router.Outlet />;

const RouterList = [
    {
        path: "/room",
        component: Layout,
        children: list,
    },
];

export default RouterList;
