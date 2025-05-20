import { _decorator, Component, RichText } from "cc";
import { PCEventType } from "../project/event/EventType";
import { EventManager } from "../project/manager/EventManager";
const { ccclass, property } = _decorator;

@ccclass("TypewriterEffect")
export class TypewriterEffect extends Component {
    @property(RichText)
    richText: RichText = null!; // 绑定的富文本组件

    @property
    charDelay: number = 0.05; // 每个字符显示间隔(秒)

    @property
    lineDelay: number = 0.3; // 行间延迟(秒)

    private fullText: string = ""; // 完整文本
    private currentText: string = ""; // 当前显示文本
    private charIndex: number = 0; // 当前字符索引
    private isPlaying: boolean = false;
    private timer: number = 0;
    private tagStack: string[] = []; // 用于处理富文本标签

    onLoad() {
        if (!this.richText) {
            this.richText = this.getComponent(RichText)!;
        }
        this.fullText = this.richText.string;
        this.richText.string = "";
    }

    start() {
        this.startEffect();
    }

    startEffect() {
        this.currentText = "";
        this.charIndex = 0;
        this.isPlaying = true;
        this.tagStack = [];
    }

    updateText(text: string) {
        this.fullText = text;
        this.startEffect();
    }

    update(dt: number) {
        if (!this.isPlaying || this.charIndex >= this.fullText.length) return;

        this.timer += dt;
        if (this.timer >= this.charDelay) {
            this.timer = 0;
            this.processNextChar();
        }
    }

    private processNextChar() {
        const char = this.fullText[this.charIndex];

        // 处理富文本标签
        if (char === "<") {
            const tagEnd = this.fullText.indexOf(">", this.charIndex);
            if (tagEnd !== -1) {
                const tag = this.fullText.substring(this.charIndex, tagEnd + 1);
                this.handleTag(tag);
                this.charIndex = tagEnd + 1;
                return;
            }
        }

        this.currentText += char;
        this.richText.string = this.currentText;
        this.charIndex++;

        // 检查是否所有文本都已显示
        if (this.charIndex >= this.fullText.length) {
            this.isPlaying = false;
            EventManager.dispatchEvent(PCEventType.EVT_TYPE_WRITER_END);
        }
    }

    private handleTag(tag: string) {
        // 闭合标签处理
        if (tag.startsWith("</")) {
            const openTag = this.tagStack.pop();
            this.currentText += tag;
            return;
        }

        // 自闭合标签处理
        if (tag.endsWith("/>")) {
            this.currentText += tag;
            return;
        }

        // 开始标签处理
        this.tagStack.push(tag);
        this.currentText += tag;
    }

    // 跳过动画立即显示全部文本
    skipToEnd() {
        this.isPlaying = false;
        this.richText.string = this.fullText;
        EventManager.dispatchEvent(PCEventType.EVT_TYPE_WRITER_END);
    }

    // 重新播放效果
    replay() {
        this.richText.string = "";
        this.startEffect();
    }
}
