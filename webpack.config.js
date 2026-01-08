const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const slsw = require("serverless-webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const isLocal = slsw.lib.webpack.isLocal;
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isLocal ? "development" : "production",
  entry: slsw.lib.entries,

  // SOLUÇÃO: Configuração correta do cache para Webpack 5
  cache: {
    type: "filesystem",
    cacheDirectory: path.resolve(__dirname, ".webpackCache"),
    buildDependencies: {
      config: [__filename],
    },
  },

  externals: [
    nodeExternals({
      allowlist: [
        /\.prisma/,
        /@prisma/,
        /@turf/,
        /yup/,
        /jsonwebtoken/,
        /dotenv-safe/,
      ],
    }),
  ],

  devtool: isLocal ? "source-map" : false,

  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },

  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },

  optimization: {
    minimize: !isLocal,
    minimizer: !isLocal
      ? [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true,
              },
              mangle: true,
            },
            extractComments: false,
          }),
        ]
      : [],
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
    ...(isLocal ? [new ForkTsCheckerWebpackPlugin()] : []),

    new CopyPlugin({
      patterns: [
        {
          from: "./node_modules/.prisma/client/schema.prisma",
          to: "./prisma",
        },
        {
          from: "./node_modules/.prisma/client/libquery_engine-*",
          to: ({ absoluteFilename }) => {
            const filename = path.basename(absoluteFilename);
            if (
              filename.includes("linux") ||
              filename.includes("debian") ||
              process.env.CI
            ) {
              return `./prisma/${filename}`;
            }
            return `./prisma/${filename}`;
          },
        },
      ],
    }),
  ],

  stats: {
    warnings: false,
    modules: false,
    chunks: false,
    colors: true,
  },
};
