// 路由模板加载标签
import React from "react";
import Index from "@/components/Pay/Index";

// 路由列表
const list = [
    {
        path: "index",
        component: Index,
        auth: true,
    },
];

//父组件结构
const Layout = () => <React.Router.Outlet />;

const RouterList = [
    {
        path: "/pay",
        component: Layout,
        children: list,
    },
];

export default RouterList;
