import { Node } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { Card } from "../../model/card/Card";
import { Player } from "../../model/player/Player";
import { AreaMediator } from "../AreaMediator";

export class BattleMediator extends AreaMediator {
    private _showCards: Array<Card>;
    private _spaceX: Array<number> = [
        0, 0, 0, 0, 0, -30, -55, -85, -125, -150, -195, -205, -220, -230, -235,
    ];
    /** 战斗期间 最大展示卡牌数 */
    private _maxShowNum = 15;
    private _cardTempNode: Node;
    private _cardsPNode: Node;
    /** 战斗开始时显示的牌数 */
    private _initCardNum: number = 5;
    private _player: Player;

    get showCardsNum() {
        return this._showCards.length;
    }

    getCardRotation(index: number) {
        let midIndex = Math.floor((this.showCardsNum - 1) / 2);
        if (index == midIndex) {
            return 0;
        }
        let remainNum = this.showCardsNum - 1;
        if (this.showCardsNum % 2 == 0) {
            if (index == midIndex + 1) {
                return 0;
            }
            remainNum--;
        }
        let max = 2.5 * remainNum;
        if (this.showCardsNum % 2 == 0) {
            return max - (index - 1) * 5;
        }
        return max - index * 5;
    }

    getCardPosY(index: number) {
        if (index == 0 || index == this.showCardsNum - 1) {
            return 0;
        }
        let midIndex = Math.floor((this.showCardsNum - 1) / 2);
        let func = (_index: number) => {
            return 50 + (_index - 1) * 15;
        };
        if (index > 0 && index < midIndex) {
            return func(index);
        }
        if (index > midIndex && index < this.showCardsNum - 1) {
            index = this.showCardsNum - index - 1;
            return func(index);
        }
    }

    initialize(): void {
        super.initialize();
        this._showCards = [];
        this._player = Player.instance;
    }

    onRegister(): void {
        super.onRegister();
        this.registerUI();
    }

    registerUI(): void {
        this._cardTempNode = this.view.getChildByName("cardTemp");
        this._cardsPNode = this.view.getChildByName("cards");
    }

    mapEventListeners(): void {}

    enterWithData(data?: any): void {
        super.enterWithData(data);
    }

    setupView() {
        this.setCards();
    }

    getShowCards() {
        return this._showCards;
    }

    setInitCards() {}

    setCards() {
        this.setInitCards();
        for (let i = 0; i < this.showCardsNum; i++) {
            let cardNode = this._cardTempNode.clone();
            this._cardsPNode.addChildCC(cardNode);
            let id = this._showCards;
        }
    }
}
ClassConfig.addClass("BattleMediator", BattleMediator);
