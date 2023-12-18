/* craco.config.js */
const path = require("path");

const AutoImport = require("unplugin-auto-import/webpack").default;

module.exports = {
    webpack: {
        // 别名
        alias: {
            "@": path.resolve("src"),
        },

        // 加载插件
        plugins: {
            add: [
                AutoImport({
                    imports: ["react", "react-router-dom"],
                }),
            ],
        },
    },
    // 配置代理解决跨域
    devServer: {
        proxy: {
            "/hotel": {
                target: "http://www.fastadmin.com/hotel",
                changeOrigin: true,
                pathRewrite: {
                    "^/hotel": "",
                },
            },
        },
    },
};
