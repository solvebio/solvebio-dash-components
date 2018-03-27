const base = require('dash-components-archetype/config/webpack/webpack.config.dev');

const extended = Object.assign({}, base, {
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.js/,
        include: ['/Users/work/Code/solvebio-dash-components/src'],
        loader: '/Users/work/Code/solvebio-dash-components/node_modules/babel-loader/lib/index.js'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      }
    ]
  }
});

module.exports = extended;