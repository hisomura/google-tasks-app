const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");

const isEnvProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isEnvProduction ? "production" : "development",
  bail: isEnvProduction,
  devtool: isEnvProduction ? undefined : "source-map",

  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: isEnvProduction ? "[name].[chunkhash].js" : "[name].js",
  },

  optimization: {
    splitChunks: {
      chunks: "all",
      name: false,
    },
  },

  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx"],
  },

  devServer: {
    open: true,
    historyApiFallback: true,
    port: 8000,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isEnvProduction ? "[name].[fullhash].css" : "[name].css",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: isEnvProduction ? "tsconfig.prod.json" : "tsconfig.json",
          },
        },
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("tailwindcss"), require("autoprefixer")],
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};
