module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname+"/../public",
        filename: "bundle.js"
    },

    module: {
        // preLoaders: [
        //   {
        //     test: /\.js$/,
        //     loader: 'eslint-loader',
        //     include: __dirname + '/lib',
        //     exclude: /bundle\.js$/
        //   }
        // ],
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { 
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                  // plugins: ['transform-strict-mode'],
                  presets: ['es2015'],
                }
            }
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
