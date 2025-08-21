import { ClassConfig } from "../../../project/config/ClassConfig";
import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { Card } from "./Card";
export class CardModel {
    private _cards: Array<Card>;
    get cards() {
        return this._cards;
    }

    initialize() {}

    constructor() {
        this.initCards();
    }

    initCards() {
        this._cards = [];
    }

    syncData(data) {
        if (data.cardIds != null) {
            let cardIds = data.cardIds;
            if (cardIds == null || cardIds.length == 0) {
                return;
            }
            for (let i = 0; i < cardIds.length; i++) {
                let cardId = cardIds[i];
                let card = new Card(cardId);
                this._cards.push(card);
            }
        }
    }

    syncDelData(data) {
        if (data.cardIds != null || data.cardIds.length != 0) {
            let cardIds = data.cardIds;
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
    }

    print() {
        console.log("玩家道具数据：", this._cards);
    }

    getAllCardIdsByLevel(level: number): Array<string> {
        if (level == 0) {
            return [];
        }
        let levels = [...ConfigReader.getAllId("PlayerLevelConfig")];
        let i = 0;
        for (let id of levels) {
            if (Number(id) > level) {
                levels.length = i;
                break;
            }
            i++;
        }
        let cardIds = new Array<string>();
        for (let id of levels) {
            let newCardsId = ConfigReader.getDataByIdAndKey(
                "PlayerLevelConfig",
                id,
                "newCardsId"
            );
            cardIds = cardIds.concat(newCardsId);
        }
        return cardIds;
    }
}
ClassConfig.addClass("CardModel", CardModel);
