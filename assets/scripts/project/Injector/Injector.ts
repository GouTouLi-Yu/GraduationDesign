import { _decorator } from "cc";
import { ClassConfig } from "../config/ClassConfig";
const { ccclass, property } = _decorator;

export class Injector {
    static classMap: Map<any, any>;

    /**
     * @description 获取单例
     * @param classType 构造函数或者字符串(从classConfig中获取)
     */
    static getInstance<T extends new (...args: any) => any>(
        classType: T | string
    ): InstanceType<T> | null {
        let _class = this.classMap.get(classType);
        if (!_class) {
            // 如果传的是字符串, 从classConfig中获取类型, 然后调用构造函数
            if (typeof classType == "string") {
                const ClassConstructor = ClassConfig.getClass(classType);
                if (!ClassConstructor) {
                    console.error(`[Injector] Class ${classType} not found in ClassConfig`);
                    return null;
                }
                _class = new ClassConstructor();
                _class.initialize?.();
            } else {
                // 传的是构造函数 --> 直接调用构造函数
                _class = new classType();
                _class.initialize?.();
            }
            this.classMap.set(classType, _class);
        }
        return _class;
    }

    static init() {
        this.classMap = new Map<any, any>();
    }

    static clear() {
        this.classMap.clear();
    }

    static delete<T extends new (...args: any) => any>(classType: T | string) {
        this.classMap.delete(classType);
    }

    static hasClass<T extends new (...args: any) => any>(
        classType: T | string
    ) {
        return this.classMap.has(classType);
    }
}
