import { behavior } from './behavior';
import { observeProps } from './props';

export function observe(vantOptions, options) {
  // 获取组件选项watch、computed
  const { watch, computed } = vantOptions;
  // 合并基础的behavior，包括created、attached钩子函数和this.set方法
  options.behaviors.push(behavior);
  /**
   * 处理组件的watch选项
   * 1. 获取组件的properties选项
   * 2. 遍历watch选项的key，如果观察的对象是properties的属性，则为该挂载observer属性，该属性的值就是watch选项的key对应的响应函数
   */
  if (watch) {
    const props = options.properties || {};
    Object.keys(watch).forEach(key => {
      if (key in props) {
        let prop = props[key];
        if (prop === null || !('type' in prop)) {
          prop = { type: prop };
        }
        prop.observer = watch[key];
        props[key] = prop;
      }
    });

    options.properties = props;
  }

  /**
   * 处理组件的computed选项
   */
  if (computed) {
    options.methods = options.methods || {};
    options.methods.$options = () => vantOptions;
    
    if (options.properties) {
      observeProps(options.properties);
    }
  }
}
