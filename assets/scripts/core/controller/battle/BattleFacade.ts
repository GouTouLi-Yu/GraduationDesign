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

    opUseCard(card: Card, targets: Array<Character>, choosingIndex?: number) {
        card.chooseIndex = choosingIndex;
        card.excute(Player.instance, targets);
    }
}
