const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

function getIPAdress() {
  var interfaces = require("os").networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
        return alias.address;
      }
    }
  }
}
module.exports = {
  mode: "development",
  entry: {
    "vant-docs": "./docs/src/index.js",
    "vant-preview": "./docs/src/preview.js"
  },
  output: {
    path: path.join(__dirname, "../docs/dist"),
    publicPath: "/",
    chunkFilename: "async_[name].js"
  },
  stats: {
    modules: false,
    children: false
  },
  serve: {
    open: true,
    host: getIPAdress(),
    devMiddleware: {
      logLevel: "warn"
    },
    hotClient: {
      logLevel: "warn",
      allEntries: true
    }
  },
  resolve: {
    extensions: [".js", ".vue", ".css"]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader",
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.(css|less)$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"]
      },
      {
        test: /\.md$/,
        use: ["vue-loader", "fast-vue-md-loader"]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new ProgressBarPlugin(),
    new HtmlWebpackPlugin({
      chunks: ["vant-docs"],
      template: "docs/src/index.tpl",
      filename: "index.html",
      inject: true
    }),
    new HtmlWebpackPlugin({
      chunks: ["vant-preview"],
      template: "docs/src/index.tpl",
      filename: "preview.html",
      inject: true
    })
  ]
};
