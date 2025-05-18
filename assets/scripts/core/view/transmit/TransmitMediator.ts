import { _decorator, Node, RichText } from "cc";
import { ClassConfig } from "../../../project/config/ClassConfig";
import { PCEventType } from "../../../project/event/EventType";
import { TypewriterEffect } from "../../../UIComponent/TypeWriter";
import { AreaMediator } from "../AreaMediator";
const { ccclass, property } = _decorator;

export class TransmitMediator extends AreaMediator {
    static fullPath: string = "prefab/transmit/";
    private _buddleNode: Node;
    private _textNode: Node;
    private _typeWriter: TypewriterEffect;
    private _richTextNode: Node;
    initialize() {
        super.initialize();
    }

    onRegister() {
        super.onRegister();
        this.registerUI();
        this.mapEventListeners();
    }
    registerUI() {
        this._buddleNode = this.view.getChildByName("buddle");
        this._textNode = this.view.getChildByName("chatText");
        this._richTextNode = this._textNode.getChildByName("RichText");
        this._typeWriter = this._richTextNode.getComponent(TypewriterEffect);
    }
    mapEventListeners() {
        this.mapEventListener(PCEventType.EVT_TYPE_WRITER_END, this, () => {
            console.log("555");
        })
    }

    enterWithData(data?: any) {
        super.enterWithData(data);
        this.setupView();
    }

    setupView() {
        this.setBuddleNode();

    }
    setRichText() {
        let richText = this._richTextNode.getComponent(RichText);
    }
    setBuddleNode() {
        this._buddleNode.addClickListener(() => {
            this._textNode.active = true;
        })
    }

}
ClassConfig.addClass("TransmitMediator", TransmitMediator);
