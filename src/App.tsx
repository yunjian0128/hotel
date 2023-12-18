import React from "react";
import { BrowserRouter, HashRouter, Link, NavLink } from "react-router-dom";
import "./App.css";
import "./global";

// 引入封装的路由
import RouterList from "./routers/index";

const App = () => {
    return (
        <HashRouter>
            <RouterList />
        </HashRouter>
    );
};

export default App;
