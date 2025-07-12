import { Card } from "../../model/card/Card";
import { Character } from "../../model/character/Character";
import { Player } from "../../model/player/Player";
import { Facade } from "../Facade";

export class BattleFacade extends Facade {
    constructor() {
        super();
    }

    initialize(): void {
        super.initialize();
    }

    opUseCard(card: Card, targets: Array<Character>, chooseIndex?: number) {
        let data = {
            chooseIndex: chooseIndex,
            targets: targets,
            executor: Player.instance,
        };
        card.syncData(data);
        card.excute(Player.instance, targets);
    }
}
