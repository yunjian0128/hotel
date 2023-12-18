// 路由模板加载标签
import React from "react";
import Index from "@/components/Business/Index";
import Register from "@/components/Business/Register";
import Login from "@/components/Business/Login";
import Profile from "@/components/Business/Profile";

// 路由列表
const list = [
    {
        path: "index",
        component: Index,
        auth: true,
    },
    {
        path: "profile",
        component: Profile,
        auth: true,
    },
    {
        path: "register",
        component: Register,
    },
    {
        path: "login",
        component: Login,
    },
];

// 父组件结构
const Layout = () => <React.Router.Outlet />;

const RouterList = [
    {
        path: "/business",
        component: Layout,
        children: list,
    },
];

export default RouterList;
