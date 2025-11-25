module.exports = {
  plugins: [
    require('postcss-import')({
      path: ['themes/demius/assets/css', 'assets/css']
    })
  ]
}