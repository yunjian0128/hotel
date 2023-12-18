import React from "react";
// 引入首页的组件
import Home from "@/components/Home";

// 引入当前目录下面的所有文件
const ModuleFile = require.context("./", true, /.tsx$/);
const RouterMap: any = [];

// 不需要合并的文件
var NoNeedAuth = ["index", "auth"];

// 循环遍历
ModuleFile.keys().map((mod, index) => {
    const ModuleName = mod.replace(/^.\/(.*)\.tsx/, "$1");

    if (!NoNeedAuth.includes(ModuleName)) {
        // 路由列表
        const ModuleList = ModuleFile(mod);

        // 追加到数组
        RouterMap.push(...ModuleList.default);
    }
});

const RouterList = () => {
    const navigate = React.Router.useNavigate();

    const back = () => {
        navigate(-1);
    };

    React.back = back;

    // 路由守卫的子组件
    const AuthRouter = (props: any) => {
        // 获取cookie信息
        const [business, SetBusiness] = React.useState(
            React.Cookie.load("business") ? React.Cookie.load("business") : {}
        );

        React.Business = business;
        React.SetBusiness = SetBusiness;
        React.navigate = navigate;

        if (props.auth) {
            // 需要登录
            // 返回对象的属性数组
            if (Object.getOwnPropertyNames(business).length <= 0) {
                // 没有登录
                return <React.Router.Navigate to="/business/login" />;
            }

            // 获取到手机号和id
            let id = business.hasOwnProperty("id") ? business.id : 0;
            let mobile = business.hasOwnProperty("mobile")
                ? business.mobile
                : "";

            var p: any = React.HTTP.post("/business/check", { id, mobile });

            // 异步操作
            p.then((result: any) => {
                if (result.code == 0) {
                    React.Cookie.remove("business");

                    return <React.Router.Navigate to="/business/login" />;
                } else {
                    // 刷新覆盖一下cookie
                    React.Cookie.save("business", result.data);

                    return <>{props.component}</>;
                }
            });

            return <>{props.component}</>;
        } else {
            // 不需要登录
            return <>{props.component}</>;
        }
    };

    return (
        <>
            <React.Router.Routes>
                {/* 默认首页 */}
                <React.Router.Route
                    path="/"
                    element={<Home />}
                ></React.Router.Route>

                <React.Router.Route
                    path="/"
                    element={
                        <>
                            <React.Router.Outlet />
                        </>
                    }
                >
                    {RouterMap.map((item: any, index: any) => {
                        return (
                            <React.Router.Route
                                key={index}
                                path={item.path}
                                element={<item.component />}
                            >
                                {item.children &&
                                    item.children.map((son: any, idx: any) => (
                                        <React.Router.Route
                                            key={idx}
                                            path={son.path}
                                            element={
                                                <AuthRouter
                                                    auth={
                                                        son.auth
                                                            ? son.auth
                                                            : false
                                                    }
                                                    component={
                                                        <son.component />
                                                    }
                                                ></AuthRouter>
                                            }
                                        ></React.Router.Route>
                                    ))}
                            </React.Router.Route>
                        );
                    })}
                </React.Router.Route>
            </React.Router.Routes>
        </>
    );
};

export default RouterList;
