import { director, ISchedulable } from "cc";

let schedulerId = 1;
let schedulerMap = new Map<
    number,
    { target: ISchedulable; callback: Function }
>();

/** 延迟多少毫秒后重复执行 */
export function setDelayInterval(callback, interval: number): number {
    let scheduler = director.getScheduler();
    let target: ISchedulable = {
        id: schedulerId.toString(),
        uuid: schedulerId.toString(),
    };
    interval /= 1000;
    schedulerMap.set(schedulerId, { target, callback });
    scheduler.schedule(callback, target, interval);
    return schedulerId++;
}
/** 取消定时器 */
export function cancelDelayInterval(schedulerId: number) {
    let scheduler = director.getScheduler();
    let item = schedulerMap.get(schedulerId);

    if (item) {
        // 使用 unschedule() 方法，传入相同的回调函数和目标对象
        scheduler.unschedule(item.callback, item.target);
        schedulerMap.delete(schedulerId);
    }
}
