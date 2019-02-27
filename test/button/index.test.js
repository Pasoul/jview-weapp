const path = require('path');
const simulate = require('miniprogram-simulate-extend');

test('comp1', () => {
  const id = simulate.load(path.resolve(__dirname, '../../src/packages/button/index'));
  const comp = simulate.render(id, { prop: 'index.test.properties' });

  const parent = document.createElement('parent-wrapper');
  comp.attach(parent);
});
