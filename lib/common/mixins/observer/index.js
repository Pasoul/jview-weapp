"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var behavior_1 = require("./behavior");
var props_1 = require("./props");
function observe(vantOptions, options) {
    // 获取组件选项watch、computed
    var watch = vantOptions.watch, computed = vantOptions.computed;
    // 合并基础的behavior，包括created、attached钩子函数和this.set方法
    options.behaviors.push(behavior_1.behavior);
    /**
     * 处理组件的watch选项
     * 1. 获取组件的properties选项
     * 2. 遍历watch选项的key，如果观察的对象是properties的属性，则为该挂载observer属性，该属性的值就是watch选项的key对应的响应函数
     */
    if (watch) {
        var props_2 = options.properties || {};
        Object.keys(watch).forEach(function (key) {
            if (key in props_2) {
                var prop = props_2[key];
                if (prop === null || !('type' in prop)) {
                    prop = { type: prop };
                }
                prop.observer = watch[key];
                props_2[key] = prop;
            }
        });
        options.properties = props_2;
    }
    /**
     * 处理组件的computed选项
     */
    if (computed) {
        options.methods = options.methods || {};
        options.methods.$options = function () { return vantOptions; };
        if (options.properties) {
            props_1.observeProps(options.properties);
        }
    }
}
exports.observe = observe;
