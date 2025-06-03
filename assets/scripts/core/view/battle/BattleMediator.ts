import { Node } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { Card } from "../../model/card/Card";
import { Player } from "../../model/player/Player";
import { AreaMediator } from "../AreaMediator";

export class BattleMediator extends AreaMediator {
    static fullPath: string = "prefab/battle/";
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
    /** 牌堆中的卡牌 */
    private _heapCards: Array<Card>;
    /** 弃牌堆 */
    private _discardCards: Array<Card>;

    get showCardsNum() {
        return Math.max(this._showCards.length, 1);
    }

    getCardRotation(index: number) {
        if (this.showCardsNum <= 5) {
            return 0;
        }
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
        if (
            index == 0 ||
            index == this.showCardsNum - 1 ||
            this.showCardsNum <= 5
        ) {
            return 0;
        }
        let midIndex = Math.floor((this.showCardsNum - 1) / 2);
        let func = (_index: number) => {
            return 50 + (_index - 1) * 10;
        };
        if (index > 0 && index < midIndex) {
            return func(index);
        }
        if (index >= midIndex && index < this.showCardsNum - 1) {
            index = this.showCardsNum - index - 1;
            return func(index);
        }
    }

    initialize(): void {
        super.initialize();
        this._showCards = [];
        this._heapCards = [];
        this._discardCards = [];
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
        this.setupView();
    }

    setupView() {
        this.setCards();
    }

    get allCards() {
        return this._player.cardModel.cards;
    }

    // 设置初始化卡牌
    setInitCards() {
        this._initCardNum = ConfigReader.getDataByIdAndKey(
            "PlayerConfig",
            "player",
            "initCardsId"
        ).length;
        let min = 0;
        for (let i = 0; i < this._initCardNum; i++) {
            let max = this._heapCards.length - 1;
            let index = Math.floor(Math.random() * (max - min + 1));
            let card = this._heapCards[index];
            if (!card) {
                return;
            }
            this._heapCards.splice(index, 1);
            this._showCards.push(card);
        }
    }

    // addShowCards(cards: Array<Card>) {
    //     for(let i = 0; i < cards.length; i++){
    //         let card = cards[i];
    //         if(this._showCards.length >= this._maxShowNum){
    //             this._discardCards.push(card);
    //             continue;
    //         }
    //     }
    // }

    setInitHeapCard() {
        this._heapCards = [...this.allCards];
    }

    setCards() {
        this._cardTempNode.active = false;
        this.setInitHeapCard();
        this.setInitCards();
        this._cardsPNode.setLayoutSpacingX(this._spaceX[this.showCardsNum - 1]);
        for (let i = 0; i < this.showCardsNum; i++) {
            let cardNode = this._cardTempNode.clone();
            cardNode.name = "card" + (i + 1);
            cardNode.active = true;
            this._cardsPNode.addChildCC(cardNode);
            let card = this._showCards[i];
            cardNode
                .getChildByName("cost")
                .setString(card.mpCost[card.level - 1].toString());
            cardNode.getChildByName("name").setString(card.name);
            cardNode.getChildByName("desc").setString(card.desc);
            cardNode.setPosition(cardNode.position.x, this.getCardPosY(i), 1);
            cardNode.angle = this.getCardRotation(i);
        }
    }
}
ClassConfig.addClass("BattleMediator", BattleMediator);
