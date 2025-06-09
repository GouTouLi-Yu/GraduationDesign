import { EventType, PCEventType } from "../../project/event/EventType";


declare module "../../project/event/EventType" {
    interface EventType {
        EVT_QUEST_ELEM_SKIP: number;// 关卡元素跳转事件
    }
}
PCEventType.EVT_QUEST_ELEM_SKIP = EventType.eventTypeFromString(
    "EVT_QUEST_ELEM_SKIP"
);