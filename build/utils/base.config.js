const ExtractTextPlugin = require('extract-text-webpack-plugin')
const helpers = require('./helpers')
const consts = require('./consts')
const project = require('./project')
const es3ifyPlugin = require('es3ify-webpack-plugin')

const config = {
  entry: helpers.getEntry(),
  output: {
    path: project.DIST,
    publicPath: project.CDN,
    filename: `${consts.SCRIPTS}[name].js`,
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass?includePaths[]=' + consts.SRC + '/styles!postcss')
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'html?interpolate&minimize=false'
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars',
        query: {
          inlineRequires: '\/images\/',
          helperDirs: [__dirname + '/../handlebars/helpers']
        }
      },
      {
        test: /\.(png|jpg|svg)$/,
        loader: `url?limit=8192&name=${consts.IMAGES}[hash].[ext]`
      }
    ]
  },
  postcss: [
    require('postcss-font-magician')(),
    require('cssnano')({
      filterPlugins: false,
      sourcemap: true,
      autoprefixer: {
        add: true,
        remove: true,
        browserslist: ['last 2 versions']
      },
      safe: true,
      discardComments: {
        removeAll: true
      }
    })
  ],
  plugins: [
    new es3ifyPlugin(),
    new ExtractTextPlugin(`${consts.STYLES}[name].css`),
    ...helpers.getPlugins()
  ],
  resolve: {
    root: __dirname,
    modulesDirectories: ['src', 'node_modules'],
    extensions: ['', '.js', '.html', '.scss']
  }
}

module.exports = config
