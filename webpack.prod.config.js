const path = require('path');

module.exports = {
  entry: [
    path.resolve(__dirname, 'src/index.js')
  ],

  output: {
    'path': path.resolve(__dirname, 'dist'),
    'filename': 'widget.js',
    'library': 'teamtv',
    'libraryTarget': 'umd'
  },

  resolve: {
    'modules': [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
  },

  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom',
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: [
          path.resolve(__dirname, 'src')
        ]
      },
      {
        test: /\.css$/i,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
        // include: [
        //   path.resolve(__dirname, 'src')
        // ]
      },
    ]
  }
}
