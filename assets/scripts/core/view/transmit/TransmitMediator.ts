import { Node } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { ConfigReader } from "../../../project/ConfigReader/ConfigReader";
import { PCEventType } from "../../../project/event/EventType";
import { UIManager } from "../../../project/manager/UIManager";
import { TypewriterEffect } from "../../../UIComponent/TypeWriter";
import { QuestHelper } from "../../helper/QuestHelper";
import { Player } from "../../model/player/Player";
import { EMapType, Portal } from "../../model/portal/portal";
import { QuestModel } from "../../model/quest/QuestModel";
import { AreaMediator } from "../AreaMediator";

export class TransmitMediator extends AreaMediator {
    private _player: Player;
    static fullPath: string = "prefab/transmit/";
    private _buddleNode: Node;
    private _textNode: Node;
    private _typeWriter: TypewriterEffect;
    private _chatEndNode: Node;
    private _textBgNode: Node;
    //********************************************************** */
    private _currentIndex: number = 0;
    private _Alice_text: Array<string>;
    private _portalLeft: Node;
    private _portalRight: Node;
    private _leftType: EMapType;
    private _rightType: EMapType;
    private _questModel: QuestModel;
    //********************************************************** */
    initialize() {
        super.initialize();
        this._player = Player.instance;
        this.setText();
        this._questModel = this._player.questModel;
    }

    onRegister() {
        super.onRegister();
        this.registerUI();
        this.mapEventListeners();
    }
    registerUI() {
        this._buddleNode = this.view.getChildByName("buddle");
        this._textNode = this.view.getChildByName("chatText");
        this._textBgNode = this._textNode.getChildByName("textBg");
        this._chatEndNode = this._textNode.getChildByName("chatEnd");
        this._typeWriter = this._textNode
            .getChildByName("RichText")
            .getComponent(TypewriterEffect);
        this._portalLeft = this.view.getChildByName("portalLeft");
        this._portalRight = this.view.getChildByName("portalRight");
    }
    mapEventListeners() {
        this.mapEventListener(PCEventType.EVT_TYPE_WRITER_END, this, () => {
            this._chatEndNode.active = true;
        });
    }

    enterWithData(data?: any) {
        super.enterWithData(data);
        this.setupView();
    }
    setupView() {
        /* this.setBuddleNode();
        this.setTextBg();
        this.setChatEnd(); */
        this.setTransmit(true);
        this.setTransmit(false);
    }

    // 当前关卡的传送门数据
    get transmitCfg() {
        let questId = QuestHelper.curQuestId;
        let cfg = ConfigReader.getDataById("TransmitLevelConfig", questId);
        return cfg;
    }

    setTransmit(left: boolean) {
        this.setTransmitType(left);
        this.setTransmitType(!left);
        this.setupPortal(left);
        this.setupPortal(!left);
    }

    setTransmitType(left: boolean) {
        if (left) {
            this._leftType = this._questModel.getNextQuestType(true);
        } else {
            this._rightType = this._questModel.getNextQuestType(false);
        }
    }

    setupPortal(left: boolean) {
        let node = left ? this._portalLeft : this._portalRight;
        let type = left ? this._leftType : this._rightType;
        let portal = new Portal(type);
        node.getChildByName("Label").setString(portal.name);
        node.loadTexture(portal.imgPath);
        if (!node.click) {
            node.click = true;
            node.addClickListener(() => {
                UIManager.gotoView(portal.viewName);
            });
        }
    }

    setText() {
        this._Alice_text = [
            "你好异世界的旅者，我是爱丽丝。",
            "欢迎来到我的世界，我是时间魔女，但是我迷失在了这里，你能帮助我回家吗？作为回报我会赐予你力量。",
            "感谢你，异世界的旅者，我将为你开启传送门，你将传送到不同的地点。",
            "如果你做好准备请触碰传送门吧，愿圣光永远照耀您。",
        ];
    }
    setTextBg() {
        this._textBgNode.addClickListener(() => {
            this._typeWriter.skipToEnd();
        });
    }
    setChatEnd() {
        this._chatEndNode.active = false;
        this._portalLeft.active = false;
        this._portalRight.active = false;
        this._textNode
            .getChildByName("RichText")
            .setString(this._Alice_text[this._currentIndex]);
        this._chatEndNode.addClickListener(() => {
            this._currentIndex++; //索引+1
            if (this._currentIndex >= this._Alice_text.length) {
                this._textNode.active = false;
                this._portalLeft.active = true;
                this._portalRight.active = true;
                return;
            }
            this._typeWriter.updateText(this._Alice_text[this._currentIndex]); //开始打字机
        });
    }

    setBuddleNode() {
        this._textNode.active = false;
        this._buddleNode.addClickListener(() => {
            this._textNode.active = true;
            this._buddleNode.active = false;
        });
    }
}
ClassConfig.addClass("TransmitMediator", TransmitMediator);
