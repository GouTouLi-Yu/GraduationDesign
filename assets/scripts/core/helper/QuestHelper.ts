import { Player } from "../model/player/Player";

export class QuestHelper {
    static get player() {
        return Player.instance;
    }

    static get curQuestId(): string {
        return "quest" + this.player.quest;
    }
}
