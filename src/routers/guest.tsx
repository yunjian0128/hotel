// 路由模板加载标签
import React from "react";
import Index from "@/components/Guest/Index";
import Add from "@/components/Guest/Add";
import Edit from "@/components/Guest/Edit";

//路由列表
const list = [
    {
        path: "index",
        component: Index,
        auth: true,
    },
    {
        path: "add",
        component: Add,
        auth: true,
    },
    {
        path: "edit",
        component: Edit,
        auth: true,
    },
];

//父组件结构
const Layout = () => <React.Router.Outlet />;

const RouterList = [
    {
        path: "/guest",
        component: Layout,
        children: list,
    },
];

export default RouterList;
