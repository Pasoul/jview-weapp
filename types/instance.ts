import { classNames } from './class-names';

/**
 * 使用declare声明的类型在全局都可以使用，
 * 使用export导出的声明文件，必须import后才能使用
 */
export interface ComponentInstance {
  triggerEvent: never;
  $emit(name: string, detail?: any): void;
  classNames: classNames;
}
