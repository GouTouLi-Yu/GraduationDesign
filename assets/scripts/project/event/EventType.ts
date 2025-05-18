export class EventType {
    constructor(parameters) { }
    private static _eventNum: number = 10000;
    private static _eventTypeMap = {};

    public static eventTypeFromString(EventName: string): number {
        if (this._eventTypeMap[EventName]) {
            throw new Error("eventType: " + EventName + " is repeated");
        }
        this._eventNum++;
        this._eventTypeMap[EventName] = this._eventNum;
        return this._eventNum;
    }
}

let PCEventType = EventType.prototype;
export { PCEventType };
