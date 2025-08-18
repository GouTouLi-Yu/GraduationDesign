import { BattleEnemyCharacter } from "../../model/battle/BattleEnemyCharacter";
import { Card } from "../../model/card/Card";

import { Player } from "../../model/player/Player";
import { Facade } from "../Facade";

export class BattleFacade extends Facade {
    constructor() {
        super();
    }

    initialize(): void {
        super.initialize();
    }

    opUseCard(
        card: Card,
        targets: Array<BattleEnemyCharacter>,
        chooseIndex?: number
    ) {
        let data = {
            chooseIndex: chooseIndex,
            targets: targets,
            executor: Player.instance,
        };
        card.syncData(data);
        card.excute(targets);
    }
}
