require('./compiler');

const fs = require('fs-extra');
const path = require('path');
const serve = require('webpack-serve');
const config = require('./webpack.doc.dev');
const dist = path.join(__dirname, '../demo/dist/packages');
const icons = path.join(__dirname, '../node_modules/@vant/icons');

fs.removeSync(dist);
fs.copySync(icons, path.join(dist, '/@vant/icons'));

serve({}, { config });
