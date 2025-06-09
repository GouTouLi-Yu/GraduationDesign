import { EventTouch, Layout, Node, NodeEventType, UITransform, Vec3 } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { MathHelper } from "../../helper/MathHelper";
import { Card, ETargetType } from "../../model/card/Card";
import { Player } from "../../model/player/Player";
import { AreaMediator } from "../AreaMediator";

/**
 * 可优化：
 * 1. 对象池
 */
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
    private _movingCardNode: Node;
    private _enemiesNode: Array<Node>;
    private _movingCard: Card;
    private _chooseEnemyIndex: number = 0;

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
        this._enemiesNode = [];
    }

    onRegister(): void {
        super.onRegister();
        this.registerUI();
    }

    registerUI(): void {
        this._cardTempNode = this.view.getChildByName("cardTemp");
        this._cardsPNode = this.view.getChildByName("cards");
        let enemiesPNode = this.view.getChildByName("enemy");
        for (let enemyNode of enemiesPNode.children) {
            this._enemiesNode.push(enemyNode);
        }
    }

    mapEventListeners(): void {}

    enterWithData(data?: any): void {
        super.enterWithData(data);
        this.setupView();
    }

    setupView() {
        this.setCards();
        this.setEnemies();
        this.test();
    }

    test() {
        let pathMap = ConfigReader.getDataByIdAndKey(
            "TransmitConfig",
            "transmit",
            "imgPath"
        );
        this.view
            .getChildByName("bg")
            .loadTexture("res/portal/transmit_img_event");

        //node.loadTexture("res/portal/" + path);
    }

    setEnemies() {
        for (let i = 0; i < this._enemiesNode.length; i++) {
            let enemyNode = this._enemiesNode[i];
            let imgNode = enemyNode.getChildByName("img");
        }
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

    addShowCards(cards: Array<Card>) {
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            if (this._showCards.length >= this._maxShowNum) {
                this._discardCards.push(card);
                continue;
            }
            this._showCards.push(card);
        }
    }

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
            cardNode.active = true;
            this._cardsPNode.addChildCC(cardNode, this.getCardLocalZOrder(i));
            let card = this._showCards[i];
            cardNode
                .getChildByName("cost")
                .setString(card.mpCost[card.level - 1].toString());
            cardNode.getChildByName("name").setString(card.name);
            cardNode.getChildByName("desc").setString(card.desc);
            cardNode.index = i;
            cardNode.card = card;
            if (!cardNode.click) {
                this.addCardTouchListener(cardNode, card, i);
                cardNode.click = true;
            }
        }
        this.refreshCards();
    }

    refreshCards() {
        this._cardsPNode.setLayoutSpacingX(this._spaceX[this.showCardsNum - 1]);
        for (let i = 0; i < this.showCardsNum; i++) {
            let cardNode = this._cardsPNode.children[i];
            cardNode.name = "card" + (i + 1);
            cardNode.index = i;
            cardNode.setPositionY(this.getCardPosY(i));
            cardNode.angle = this.getCardRotation(i);
            cardNode.setOpacity(1);
        }
    }

    addCardTouchListener(cardNode: Node, card: Card, index: number) {
        cardNode.on(NodeEventType.TOUCH_START, (event) => {
            this.onTouchStart(event, card, cardNode);
        });
        cardNode.on(NodeEventType.TOUCH_MOVE, (event) => {
            this.onTouchMove(event);
        });
        cardNode.on(NodeEventType.TOUCH_CANCEL, (event) => {
            this.onTouchEnd(event);
        });
        cardNode.on(NodeEventType.TOUCH_END, (event) => {
            this.onTouchEnd(event);
        });
    }

    onTouchStart(event: EventTouch, card: Card, cardNode: Node) {
        this._movingCardNode = cardNode;
        for (let child of this._cardsPNode.children) {
            if (child != cardNode) {
                child.setOpacity(0.4);
            }
        }
        this._movingCardNode.angle = 0;
        this._movingCardNode.setLocalZOrder(100000);
        this._cardsPNode.getComponent(Layout).enabled = false;
        this.moveCard(event);
    }

    getCardLocalZOrder(index: number): number {
        return index;
    }

    moveCard(event: EventTouch) {
        const mousePos = event.getUILocation();
        const newPos = new Vec3();
        this._movingCardNode.parent
            ?.getComponent(UITransform)
            ?.convertToNodeSpaceAR(new Vec3(mousePos.x, mousePos.y, 1), newPos);
        this._movingCardNode.setPosition(
            newPos.x,
            newPos.y - this._movingCardNode.getHeight() / 2,
            1
        );
    }

    onTouchMove(event: EventTouch) {
        this.moveCard(event);
    }

    recoverCard() {
        let index = this._movingCardNode.index;
        this._movingCardNode.setPositionY(this.getCardPosY(index));
        this._movingCardNode.angle = this.getCardRotation(index);
        this._movingCardNode.setLocalZOrder(this.getCardLocalZOrder(index));
        this._cardsPNode.getComponent(Layout).enabled = true;
        this.resetMovingCard();
        for (let i = 0; i < this._cardsPNode.children.length; i++) {
            let cardNode = this._cardsPNode.children[i];
            cardNode.setOpacity(1);
        }
    }

    getEnemyWorldPos(i: number) {}

    private resetMovingCard() {
        this._movingCardNode = null;
        this._movingCard = null;
        this._chooseEnemyIndex = -1;
    }

    useCard(index: number) {
        this._movingCardNode.destroy();
        this._showCards.splice(index, 1);
        this.resetMovingCard();
        this.refreshCards();
    }

    onTouchEnd(event: EventTouch) {
        if (!this._movingCardNode) {
            return;
        }
        console.log("鼠标位置：", event.getUILocation());
        let mousePos = event.getUILocation();
        if (mousePos.y > 520) {
            this._cardsPNode.getComponent(Layout).enabled = true;
            let index = this._movingCardNode.index;
            let card = this._showCards[index];
            // 对敌人单体目标
            if (card.target == ETargetType.enemy_single) {
                for (let i = 0; i < this._enemiesNode.length; i++) {
                    let enemyNode = this._enemiesNode[i];
                    if (
                        MathHelper.isInNodeByWorld(
                            mousePos,
                            enemyNode.getChildByName("img")
                        )
                    ) {
                        // 碰到了敌人
                        this.useCard(index);
                        this._chooseEnemyIndex = i;
                        break;
                    } else {
                        this.recoverCard();
                    }
                }
            } else {
                this.useCard(index);
            }
        } else {
            this.recoverCard();
        }
    }
}
ClassConfig.addClass("BattleMediator", BattleMediator);
