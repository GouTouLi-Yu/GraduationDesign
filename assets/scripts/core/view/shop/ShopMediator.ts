import { _decorator, Node } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { Card } from "../../model/card/Card";
import { Player } from "../../model/player/Player";
import { AreaMediator } from "../AreaMediator";
const { ccclass, property } = _decorator;

@ccclass("ShopMediator")
export class ShopMediator extends AreaMediator {
    static fullPath: string = "prefab/shop/";
    private _cardsNode: Node;
    private _singleNode: Node;
    private _exhibitcards: Array<Card>;
    private _initCardNum: number = 7;
    private _cards: Array<Card>;
    private _allCards: Array<number>;
    private _currentIndex: number = 0;
    private _player: Player;
    get exhibitCardsNum() {
        return Math.max(this._exhibitcards.length, 1); //按情况来说最小数量应该是7张
    }
    getCardRotation(index: number) { }
    initialize(): void {
        super.initialize();
        this._exhibitcards = [];
    }
    onRegister() {
        super.onRegister();
        this.registerUI();
    }
    registerUI() {
        this._cardsNode = this.view.getChildByName("Cards");
        this._singleNode = this.view.getChildByName("Single");
        this._allCards = [];
        this._player = Player.instance;
        this._cards = [];
    }
    enterWithData(data?: any): void {
        super.enterWithData(data);
        this.setupView();
    }
    setupView() {
        this.setCards();
    }

    addExhibitCards() {
        let cardsId = this._player.cardModel.getAllCardIdsByLevel(this._player.level);
        for (let i = 0; i < cardsId.length; i++) {
            this._cards[i] = ConfigReader.getDataById("CardConfig", cardsId[i])
            this._exhibitcards.push(this._cards[i]);
            console.log("卡牌：", this._exhibitcards);
        }
        /* for (let i = 0; i < this._player.level - 1; i++) {
            this._cardsId = this._cardsId.concat(
                ConfigReader.getDataByIdAndKey(
                    "PlayerLevelConfig",
                   (i + 1).toString(),
                   "newCardsId"
               )
            );
          for (let i = 0; i < this._cardsId.length; i++) {
               // if (!cards) {
               //   return;
               // } 
                 this._exhibitcards.push(cards[this._cardsId[i]]);
                 console.log("卡牌：", cards[this._cardsId[i]]);
            }
         }
         console.log("展示卡牌：", this._exhibitcards); */
    }
    setCards() {
        this.addExhibitCards();
        this._singleNode.active = false;
        this._initCardNum = Math.min(
            this._initCardNum,
            this._exhibitcards.length
        );
        this._cardsNode.setLayoutSpacingX(this.exhibitCardsNum - 1);
        for (let i = 0; i < this.exhibitCardsNum; i++) {
            let cardNode = this._singleNode.clone();
            cardNode.name = "Single" + (i + 1);
            cardNode.active = true;
            this._cardsNode.addChildCC(cardNode, i);
            let card = this._exhibitcards[i];
            cardNode
                .getChildByName("price")
                .setString(card.buyPrice.toString());
            cardNode
                .getChildByName("Card")
                .getChildByName("cost")
                .setString(card.mpCost[i].toString());
            cardNode
                .getChildByName("Card")
                .getChildByName("name")
                .setString(card.name);
            cardNode
                .getChildByName("Card")
                .getChildByName("desc")
                .setString(card.desc);
            cardNode.index = i;
            cardNode.card = card;
        }
    }
    start() { }
}
ClassConfig.addClass("ShopMediator", ShopMediator);
