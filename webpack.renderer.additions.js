const path = require("path");
module.exports = {
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				include: /node_modules/,
				use: [
					"react-hot-loader/webpack",
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-react", "@babel/preset-typescript"]
						}
					}
				]
			},
			{
				test: /\.jsx?$/,
				include: /node_modules/,
				use: [
					"react-hot-loader/webpack",
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-react", "@babel/preset-typescript"]
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx"],
		alias: {
			"react-dom": "@hot-loader/react-dom"
		}
	},
};
