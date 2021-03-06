/**
 * 小程序setData(data, function() {})
 * 转换成链式调用
 * setAsync(this, data).then()
 */
function setAsync(context, data) {
    return new Promise(resolve => {
        context.setData(data, resolve);
    });
}
;
export const behavior = Behavior({
    created() {
        if (!this.$options) {
            return;
        }
        const cache = {};
        // 小程序原生不支持computed，需要处理组件选项的computed
        const { computed } = this.$options();
        const keys = Object.keys(computed);
        /**
         * 为组件实例挂载caleComputed方法，该方法的返回值是一个对象，对象的key是computed对象的每个key，value是每个key函数执行后的返回值。
         *
         * example：
         *
         * Component({
         *    computed: {
         *      a() {
         *        return 'a'
         *      },
         *      b() {
         *        return 'b'
         *      }
         *    }
         * })
         *
         * needUpdate: {
         *    a: 'a',
         *    b: 'b'
         * }
         */
        this.calcComputed = () => {
            const needUpdate = {};
            keys.forEach(key => {
                const value = computed[key].call(this);
                // 如果computed定义相同的key，并且返回值不同，则会覆盖当前key对应的value
                if (cache[key] !== value) {
                    cache[key] = needUpdate[key] = value;
                }
            });
            return needUpdate;
        };
    },
    attached() {
        this.set();
    },
    methods: {
        // set data and set computed data
        /**
           * 执行computed的每一个方法，将返回对象作为data调用setData，为组件data选项新增key
           * example:
           * Computed({
           *  data: {
           *    a:1
           *  },
           *  computed: {
           *    b() {
           *      return this.data.a + 1
           *    }
           *  }
           * })
           *
           * 1. 假设此时设置了a = 2,即执行stack.push(setAsync(this, data))，此时this.data.a = 2
           * 2. 将computed计算的返回对象{b: this.data.a + 1}作为data，继续调用setAsync，即setData({b: this.data.a + 1})
           * 3. 此时组件data选项包含了两个key：{a: 1, b: 3}
           */
        set(data, callback) {
            const stack = [];
            if (data) {
                // setAsync将setData函数封装成promise
                stack.push(setAsync(this, data));
            }
            if (this.calcComputed) {
                stack.push(setAsync(this, this.calcComputed()));
            }
            return Promise.all(stack).then(res => {
                if (callback && typeof callback === 'function') {
                    callback.call(this);
                }
                return res;
            });
        }
    }
});
