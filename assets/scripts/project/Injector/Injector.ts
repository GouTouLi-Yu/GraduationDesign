import { _decorator } from "cc";
const { ccclass, property } = _decorator;

export class Injector {
    // static classMap: Map<any, any>;
    // static getInstance<T extends new (...args: any) => any>(
    //     classType: T | string
    // ): InstanceType<T> {
    //     let _class = this.classMap.get(classType);
    //     if (!_class) {
    //         if(classType instanceof String) {
    //         }
    //         _class = new classType();
    //         this.classMap.set(classType, _class);
    //     }
    //     return _class;
    // }
    // static init() {
    //     this.classMap = new Map<any, any>();
    // }
    // static clearAll() {
    //     this.classMap.clear();
    // }
    // static clearClass<T extends new (...args: any) => any>(classType: T) {
    //     this.classMap.delete(classType);
    // }
}
