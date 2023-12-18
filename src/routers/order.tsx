// 路由模板加载标签
import React from "react";
import Info from "@/components/Order/Info";
import Index from "@/components/Order/Index";
import Comment from "@/components/Order/Comment";

// 路由列表
const list = [
    {
        path: "info",
        component: Info,
        auth: true,
    },
    {
        path: "index",
        component: Index,
        auth: true,
    },
    {
        path: "comment",
        component: Comment,
        auth: true,
    },
];

//父组件结构
const Layout = () => <React.Router.Outlet />;

const RouterList = [
    {
        path: "/order",
        component: Layout,
        children: list,
    },
];

export default RouterList;
