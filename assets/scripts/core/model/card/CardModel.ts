import { ClassConfig } from "../../../project/config/ClassConfig";
import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { Card } from "./Card";

export class CardModel {
    private _cards: Array<Card>;

    initialize() {
        this._cards = [];
    }

    syncData(cardIds: Array<string>) {
        if (cardIds == null || cardIds.length == 0) {
            return;
        }
        for (let i = 0; i < cardIds.length; i++) {
            let cardId = cardIds[i];
            let cardConfig = ConfigReader.getDataById("CardConfig", cardId);
            let card = new Card();
            card.syncData(cardConfig);
            this._cards.push(card);
        }
    }

    syncDelData(cardIds: Array<string>) {
        if (cardIds == null || cardIds.length == 0) {
            return;
        }
        for (let i = cardIds.length - 1; i >= 0; i--) {
            let cardId = cardIds[i];
            let index = this._cards.findIndex((card) => card.id == cardId);
            if (index != -1) {
                this._cards.splice(index, 1);
            }
        }
    }

    clearAll() {
        this._cards = [];
    }

    print() {
        console.log("玩家道具数据：", this._cards);
    }
}
ClassConfig.addClass("CardModel", CardModel);
