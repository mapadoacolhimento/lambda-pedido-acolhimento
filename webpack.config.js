// webpack.config.js - VERSÃO FUNCIONAL
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const slsw = require("serverless-webpack");

const isLocal = slsw.lib.webpack.isLocal;

module.exports = {
  mode: isLocal ? "development" : "production",
  entry: slsw.lib.entries,

  ...(process.env.WEBPACK_CACHE !== "false" &&
    isLocal && {
      cache: {
        type: "filesystem",
        cacheDirectory: path.resolve(__dirname, ".webpackCache"),
      },
    }),

  externals: [nodeExternals()],
  devtool: isLocal ? "source-map" : false,

  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },

  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "./node_modules/.prisma/client/schema.prisma",
          to: "./prisma/schema.prisma",
        },
      ],
    }),
  ],

  // Ignora avisos
  ignoreWarnings: [{ module: /node_modules/ }],
};
