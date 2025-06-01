import { ClassConfig } from "../../../project/config/ClassConfig";
import { Card } from "../../model/card/Card";
import { AreaMediator } from "../AreaMediator";

export class BattleMediator extends AreaMediator {
    private _cards: Array<Card>;
    private _spaceX: Array<number> = [0, 0, 0, 0, 0, -30];
    private _maxShowNum = 15;

    /** key: 展示的卡牌数量, value：角度 ———— 最左边的卡牌索引为0, 向右依次递增, 6张牌，我们只需要记录3张牌的角度, 后边的牌直接取对称牌的负值即可 */
    private _rotation: Map<number, Array<number>> = new Map([
        [6, [0, 0, 0]],
        [7, [0, 0, 0, 0]],
        [8, [0, 0, 0, 0]],
        [9, [0, 0, 0, 0, 0]],
        [10, [0, 0, 0, 0, 0]],
        [11, [0, 0, 0, 0, 0, 0]],
        [12, [0, 0, 0, 0, 0, 0]],
        [13, [0, 0, 0, 0, 0, 0, 0]],
        [14, [0, 0, 0, 0, 0, 0, 0]],
        [15, [0, 0, 0, 0, 0, 0, 0, 0]],
    ]);

    // key: 展示的卡牌数量, value：纵坐标 ———— 规则同旋转
    private _posY: Map<number, Array<number>> = new Map([
        [6, [0, 0, 0]],
        [7, [0, 0, 0, 0]],
        [8, [0, 0, 0, 0]],
        [9, [0, 0, 0, 0, 0]],
        [10, [0, 0, 0, 0, 0]],
        [11, [0, 0, 0, 0, 0, 0]],
        [12, [0, 0, 0, 0, 0, 0]],
        [13, [0, 0, 0, 0, 0, 0, 0]],
        [14, [0, 0, 0, 0, 0, 0, 0]],
        [15, [0, 0, 0, 0, 0, 0, 0, 0]],
    ]);

    initialize(): void {
        super.initialize();
    }

    onRegister(): void {
        super.onRegister();
        this.registerUI();
    }

    registerUI(): void {}

    mapEventListeners(): void {}

    enterWithData(data?: any): void {
        super.enterWithData(data);
    }

    setupView() {
        console.log(this._cards);
    }
}
ClassConfig.addClass("BattleMediator", BattleMediator);
