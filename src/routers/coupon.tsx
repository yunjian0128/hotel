// 路由模板加载标签
import React from "react";
import Index from "@/components/Coupon/Index";
import Info from "@/components/Coupon/Info";
import List from "@/components/Coupon/List";

// 路由列表
const list = [
    {
        path: "index",
        component: Index,
        auth: true,
    },
    {
        path: "info",
        component: Info,
    },
    {
        path: "list",
        component: List,
    },
];

// 父组件结构
const Layout = () => <React.Router.Outlet />;

const RouterList = [
    {
        path: "/coupon",
        component: Layout,
        children: list,
    },
];

export default RouterList;
