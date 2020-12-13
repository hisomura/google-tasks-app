import { Configuration } from "webpack";
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const HtmlWebpackPlugin = require("html-webpack-plugin");
// import HtmlWebpackPlugin from "html-webpack-plugin";

const path = require("path");

const prodMode = process.env.NODE_ENV === "production";

const config: Configuration = {
  mode: prodMode ? "production" : "development",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: prodMode ? "[name].[fullhash].js" : "[name].js",
  },

  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx"],
  },

  devtool: prodMode ? undefined : "source-map",

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
      filename: prodMode ? "[name].[fullhash].css" : "[name].css",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: prodMode ? "tsconfig.prod.json" : "tsconfig.json",
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

export default config;
