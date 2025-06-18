import { _decorator, Button, Node } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { GameManager } from "../../../project/manager/GameManager";
import { Card } from "../../model/card/Card";
import { Player } from "../../model/player/Player";
import { AreaMediator } from "../AreaMediator";
const { ccclass, property } = _decorator;

export enum ElementType {
    fire = 1,
    water = 2,
    windy = 3
}

@ccclass("ShopMediator")
export class ShopMediator extends AreaMediator {
    static fullPath: string = "prefab/shop/";
    private _cardsNode: Node;
    private _singleNode: Node;
    private _exhibitcards: Array<Card>;
    private _initCardNum: number = 7;
    private _player: Player;
    //private _currentElem: ElementType;
    private _BgNode: Node;
    private _cardNode: Node;
    private _shopBtn: Node;
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
        this._cardsNode = this.view.getChildByName("cards");
        this._singleNode = this.view.getChildByName("single");
        this._BgNode = this.view.getChildByName("shopBg");
        this._shopBtn = this.view.getChildByName("shopBtn");
        this._player = Player.instance;
    }

    enterWithData(data?: any): void {
        super.enterWithData(data);
        this.setupView();
    }
    setupView() {
        this.setElemBg();
        this.setCards();
        this.setShopping();
    }
    addExhibitCards() {
        let cardsId = this._player.cardModel.getAllCardIdsByLevel(
            this._player.level
        );
        for (let i = 0; i < cardsId.length; i++) {
            let card = new Card(cardsId[i]);
            this._exhibitcards.push(card);
        }
    }
    setElemBg() {
        let currentIndex = Math.floor(Math.random() * 3);
        console.log("currentIndex", currentIndex);
        let path = ElementType[currentIndex + 1];
        console.log("path", path);
        if (path == undefined || path == null) {
            console.log("path is undefined", path);
        }
        this._BgNode.loadTexture("res/map/shop/" + "shop_" + path);

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
            cardNode.name = "single" + (i + 1);
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
    setItems() { }
    setShopping() {
        this._shopBtn.getComponent(Button).interactable = false;
        for (let i = 0; i < this.exhibitCardsNum; i++) {
            this._cardNode = this._cardsNode.getChildByName("single" + (i + 1));
            console.log("this._cardsNode", this._cardsNode);
            console.log("cardNode", this._cardNode);
            this._cardNode.buyPrice = this._exhibitcards[i].buyPrice;
            if (!this._cardNode.click) {
                this._cardNode.addClickListener(() => {
                    console.log("this._player.gold", this._player.gold);
                    console.log("price", this._cardNode.buyPrice);
                    this._cardNode.getComponent(Button).interactable = false;
                    if (this._player.gold < this._cardNode.buyPrice) {
                        //置灰
                    } if (this._player.gold >= this._cardNode.buyPrice) {
                        this._shopBtn.getComponent(Button).interactable = true;
                        this.setShopBtn();
                    }
                });
                this._cardNode.click = true;
            }
        }

    }
    setShopBtn() {
        this._shopBtn.addClickListener(() => {
            console.log("this._shopBtn", this._shopBtn.getComponent(Button).interactable);
            let gold = this._player.gold - this._cardNode.buyPrice;
            GameManager.saveDataToDisk({ gold: gold });
            console.log("gold", gold);
            console.log("this._player.gold", this._player.gold);
        });

    }
    start() { }
}
ClassConfig.addClass("ShopMediator", ShopMediator);
