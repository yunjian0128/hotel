import React from "react";

const Menu = () => {
    const location = React.Router.useLocation();
    const [activeRoute, setActiveRoute] = React.useState("/");

    // 监听路由变化
    React.useEffect(() => {
        setActiveRoute(location.pathname);
    }, [location.pathname]);

    return (
        <div className="footer">
            <React.Router.Link className="item" to="/">
                <div className="item_img">
                    {activeRoute === "/" ? (
                        <img src="/assets/images/activehome.png" alt="" />
                    ) : (
                        <img src="/assets/images/home.png" alt="" />
                    )}
                </div>

                <div className="title"></div>
            </React.Router.Link>
            <React.Router.Link className="item" to="/business/index">
                <div className="item_img">
                    {activeRoute === "/business/index" ? (
                        <img src="/assets/images/activemy.png" alt="" />
                    ) : (
                        <img src="/assets/images/my.png" alt="" />
                    )}
                </div>
                <div className="title"></div>
            </React.Router.Link>
        </div>
    );
};

export default Menu;
