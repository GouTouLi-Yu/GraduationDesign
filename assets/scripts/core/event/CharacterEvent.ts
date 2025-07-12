import { EventType, PCEventType } from "./../../project/event/EventType";

declare module "./../../project/event/EventType" {
    interface EventType {
        EVT_CHARACTER_ADD_REMAIN_HP: number;
        EVT_CHARACTER_REDUCE_REMAIN_HP: number;
    }
}
PCEventType.EVT_CHARACTER_ADD_REMAIN_HP = EventType.eventTypeFromString(
    "EVT_CHARACTER_ADD_REMAIN_HP"
);
PCEventType.EVT_CHARACTER_REDUCE_REMAIN_HP = EventType.eventTypeFromString(
    "EVT_CHARACTER_REDUCE_REMAIN_HP"
);
