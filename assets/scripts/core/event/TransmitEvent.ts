import { EventType, PCEventType } from "../../project/event/EventType";


declare module "../../project/event/EventType" {
    interface EventType {
        EVT_TRANSMIT_END: number; // 关闭传送页面事件
        EVT_QUEST_ELEM_SKIP: number;// 关卡元素跳转事件
    }
}
PCEventType.EVT_TRANSMIT_END = EventType.eventTypeFromString(
    "EVT_TRANSMIT_END"
);
PCEventType.EVT_QUEST_ELEM_SKIP = EventType.eventTypeFromString(
    "EVT_QUEST_ELEM_SKIP"
);