import { BattleMonsterCharacter } from "../../model/battle/BattleMonsterCharacter";
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
        monsters: Array<BattleMonsterCharacter>,
        chooseIndex?: number
    ) {
        let data = {
            chooseIndex: chooseIndex,
            monsters: monsters,
            executor: Player.instance.battlePlayerCharacter,
        };
        for (let strategy of card.strategise) {
            strategy.syncData(data);
        }
        card.execute();
    }
}
