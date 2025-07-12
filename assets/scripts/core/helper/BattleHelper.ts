import { Battle } from "../model/battle/Battle";
import { Character } from "./../model/character/Character";
export class BattleHelper {
    static getBattleData(character: Character): Battle {
        return character.getBattleData();
    }
}
