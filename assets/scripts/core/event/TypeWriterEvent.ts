import { EventType, PCEventType } from "./../../project/event/EventType";

declare module "./../../project/event/EventType" {
    interface EventType {
        EVT_TYPE_WRITER_END: number;// 打字机结束事件
    }
}
PCEventType.EVT_TYPE_WRITER_END = EventType.eventTypeFromString(
    "EVT_TYPE_WRITER_END"
);
