import { ClassConfig } from "../../../project/config/ClassConfig";
import { Card } from "../../model/card/Card";
import { AreaMediator } from "../AreaMediator";

export class BattleMediator extends AreaMediator {
    private _cards: Array<Card>;
    private _spaceX: Array<number> = [0, 0, 0, 0, 0, -30, -55, -85, -125, -150, -195, -205, -220, -230, -235];
    private _maxShowNum = 15;

    /** key: 展示的卡牌数量, value：角度 ———— 最左边的卡牌索引为0, 向右依次递增, 6张牌，我们只需要记录3张牌的角度, 后边的牌直接取对称牌的负值即可 */
    private _rotation: Map<number, Array<number>> = new Map([
        [6, [10, 5, 0]],
        [7, [15, 10, 5, 0]],
        [8, [15, 10, 5, 0]],
        [9, [20, 15, 10, 5, 0]],
        [10, [20, 15, 10, 5, 0]],
        [11, [25, 20, 15, 10, 5, 0]],
        [12, [25, 20, 15, 10, 5, 0]],
        [13, [30, 25, 20, 15, 10, 5, 0]],
        [14, [30, 25, 20, 15, 10, 5, 0]],
        [15, [35, 30, 25, 20, 15, 10, 5, 0]],
    ]);

    // key: 展示的卡牌数量, value：纵坐标 ———— 规则同旋转
    private _posY: Map<number, Array<number>> = new Map([
        [6, [0, 50, 65]],
        [7, [0, 50, 65, 80]],
        [8, [0, 50, 65, 80]],
        [9, [0, 50, 65, 80, 95]],
        [10, [0, 50, 65, 80, 95]],
        [11, [0, 50, 65, 80, 95, 110]],
        [12, [0, 50, 65, 80, 95, 110]],
        [13, [0, 50, 65, 80, 95, 110, 125]],
        [14, [0, 50, 65, 80, 95, 110, 125]],
        [15, [0, 50, 65, 80, 95, 110, 125, 140]],
    ]);
    getCardPosY(index: number) {
        if (index == 0) {
            return 0;
        }
        if (index - 1) { }
    }

    initialize(): void {
        super.initialize();
    }

    onRegister(): void {
        super.onRegister();
        this.registerUI();
    }

    registerUI(): void { }

    mapEventListeners(): void { }

    enterWithData(data?: any): void {
        super.enterWithData(data);
    }

    setupView() {
        console.log(this._cards);
    }
}
ClassConfig.addClass("BattleMediator", BattleMediator);
