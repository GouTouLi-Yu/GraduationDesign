import { EventType, PCEventType } from "./../../project/event/EventType";

declare module "./../../project/event/EventType" {
    interface EventType {
        EVT_MAIN_MENU_START_GAME: number;
    }
}
PCEventType.EVT_MAIN_MENU_START_GAME = EventType.eventTypeFromString(
    "EVT_MAIN_MENU_START_GAME"
);
