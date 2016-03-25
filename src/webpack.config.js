module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname+"/../public",
        filename: "bundle.js"
    },

    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
        ]
    },

    externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        "jquery": "jQuery"
    },

    devServer: {
        contentBase: __dirname+"/../public",
    }
};
