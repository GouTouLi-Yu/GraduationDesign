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
    private _chatEndNode: Node;
    private _textBgNode: Node;
    private _rtComponent: RichText;//富文本组件
    //********************************************************** */
    private _currentIndex: number = 0;
    private _Alice_text: Array<string>;
    //********************************************************** */
    initialize() {
        super.initialize();
        this.setText();
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
        this._richTextNode = this._textNode.getChildByName("RichText");
        this._rtComponent = this._richTextNode.getComponent(RichText);
        this._chatEndNode = this._textNode.getChildByName("chatEnd");
        this._typeWriter = this._richTextNode.getComponent(TypewriterEffect);
    }
    mapEventListeners() {
        this.mapEventListener(PCEventType.EVT_TYPE_WRITER_END, this, () => {
            this._chatEndNode.active = true;
        })
    }

    enterWithData(data?: any) {
        super.enterWithData(data);
        this.setupView();
    }
    setupView() {
        this.setBuddleNode();
        this.setTextBg();
        this.setChatEnd();
    }
    setText() {
        this._Alice_text =
            [
                '欢迎来到我的世界，我是时间魔女，但是我迷失在了这里，你能帮助我回家吗？作为回报我会赐予你力量。',
                '感谢你，异世界的旅者，我将为你开启传送门，你将传送到不同的地点。',
                '如果你做好准备请触碰传送门吧，愿圣光永远照耀您'
            ];
    }
    setTextBg() {
        this._textBgNode.addClickListener(() => {
            this._typeWriter.skipToEnd();
        })
    }
    setChatEnd() {
        this._rtComponent.string = this._Alice_text[this._currentIndex];
        this._chatEndNode.addClickListener(() => {//点击跳转下一条文
            this._currentIndex++;//索引+1
            this._rtComponent.string = this._Alice_text[this._currentIndex];//设置文本
            this._typeWriter.startEffect();//开始打字机
            if (this._currentIndex >= this._Alice_text.length) {//判断是否到最后一条
                this._chatEndNode.active = false;
            }
        })
    }
    setRichText() {
        let richText = this._richTextNode.getComponent(RichText);
    }
    setBuddleNode() {
        this._buddleNode.addClickListener(() => {
            this._textNode.active = true;
            this._buddleNode.active = false;
        })
    }

}
ClassConfig.addClass("TransmitMediator", TransmitMediator);
