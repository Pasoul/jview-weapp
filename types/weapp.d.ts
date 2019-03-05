type BehaviorOptions = {
  [key: string]: any & ThisType<any>
};

// 使用declare全局方法的类型，在编译结束后会被删除
// 需要注意的是，声明语句中只能定义类型，切勿在声明语句中定义具体的值
declare function Behavior(options: BehaviorOptions): void
declare function Component(options: any): void

// declare namespace表示全局变量是一个对象，包含很多子属性
declare namespace Weapp {
  /**
   * interface 和 type 都可以声明全局类型
   * 暴露在最外层的 interface 或 type 会作为全局类型作用于整个项目中，
   * 我们应该尽可能的减少全局变量或全局类型的数量。故应该将他们放到 namespace 下
   * 这里放在Weapp下，可以通过Weapp.Component访问
   */
  interface Component {
    [key: string]: any
    getRelationNodes(selector: string): any[]
    setData(data: any, callback?: Function): void
  }

  interface FormField {
    data: {
      name: string
      value: any
    }
  }

  interface Target {
    id: string
    tagName: string
    dataset: {
      [key: string]: any
    }
  }

  interface Event {
    /**
     * 代表事件的类型。
     */
    type: string
    /**
     * 页面打开到触发事件所经过的毫秒数。
     */
    timeStamp: number
    /**
     * 触发事件的源组件。
     */
    target: Target
    /**
     * 事件绑定的当前组件。
     */
    currentTarget: Target
    /**
     * 	额外的信息
     */
    detail: any
  }

  interface Touch {
    /**
     * 触摸点的标识符
     */
    identifier: number
    /**
     * 距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴
     */
    pageX: number
    /**
     * 距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴
     */
    pageY: number
    /**
     * 距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴
     */
    clientX: number
    /**
     * 距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴
     */
    clientY: number
  }

  interface TouchEvent extends Event {
    touches: Array<Touch>
    changedTouches: Array<Touch>
  }

  interface Page {
    selectComponent(selector: string): Component
  }

  interface TempFile {
    path: string
    size: number
  }

  interface UploadTask {
    absort(): void
    offHeadersReceived(callback?:Function): void
    offProgressUpdate(callback?:Function): void
    onHeadersReceived(callback?:Function): void
    onProgressUpdate(callback?:Function): void
  }
}
