type ClassValue =
  | string
  | number
  | ClassDictionary
  | ClassArray
  | undefined
  | null
  | boolean;

/**
 * 接口Interface可以用于对 【对象的形状】进行描述
 * 这里定义了接口ClassDictionary，描述一个对象必须含有id属性，属性值可以是任意类型的值
 */
interface ClassDictionary {
  [id: string]: any;
}

interface ClassArray extends Array<ClassValue> {}

export type classNames = (...classes: ClassValue[]) => string;
