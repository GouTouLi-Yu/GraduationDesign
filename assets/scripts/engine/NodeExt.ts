import {
    Color,
    EventTouch,
    instantiate,
    Label,
    Layout,
    Material,
    Node,
    NodeEventType,
    RichText,
    Sprite,
    Vec2,
} from "cc";
import { MyResManager } from "../project/manager/ResManager";

declare module "cc" {
    interface Node {
        [x: string]: any;
        clone(): Node;
        addChildCC(child: Node, zOrder?: number, tag?: string | number);
        _zOrder: number | null;
        setLocalZOrder(zorder: number);
        setTag(tag: string | number);
        _tag: string | number;
        addClickListener(callback, noCheckGuide?: boolean, checkMove?: boolean);
        _clickList: any[];
        removeTouchListener();
        setString(str: string);
        setLayoutSpacingX(val: number);
        setLayoutSpacingY(val: number);
        setPositionX(x: number);
        setPositionY(y: number);
        setPositionCC(pos: Vec2, zOrder?: number);
        getPositionX(): number;
        getPositionY(): number;
        getPositionCC(): Vec2;
        getWidth(): number;
        getHeight(): number;
        getSize(): Vec2;
        loadTexture(url: string, callback?: Function);
        setOpacity(val: number);
        setGray(isGray: boolean): void;
        setGrayByMaterial(isGray: boolean, node: Node): void;
    }
}

Node.prototype.setGrayByMaterial = function (
    isGray: boolean,
    materialNode: Node
) {
    if (materialNode == null) {
        console.error("置灰材质节点为空");
        return;
    }
    if (!this) {
        return;
    }
    let tempMaterial: Material;
    let materialNodeLabel = materialNode.getComponent(Label);
    let materialNodeSprite = materialNode.getComponent(Sprite);
    tempMaterial =
        materialNodeLabel?.customMaterial ?? materialNodeSprite?.customMaterial;

    if (tempMaterial == null) {
        console.error("置灰材质为空");
        return;
    }
    let sprite: Sprite = this.getComponent(Sprite);
    if (sprite) {
        sprite.customMaterial = isGray ? tempMaterial : null;
    }
    let label: Label = this.getComponent(Label);
    if (label) {
        label.customMaterial = isGray ? tempMaterial : null;
    }
    for (let child of this.children) {
        child.setGrayByMaterial(isGray, materialNode);
    }
};

Node.prototype.setGray = function (isGray: boolean) {
    if (!this) {
        return;
    }
    let sprite: Sprite = this.getComponent(Sprite);
    let func = (_color: Color): Color => {
        return isGray ? Color.GRAY : Color.WHITE;
    };
    if (sprite) {
        sprite.color = func(sprite.color);
    }
    let label: Label = this.getComponent(Label);
    if (label) {
        label.color = func(label.color);
    }
    for (let child of this.children) {
        child.setGray(isGray);
    }
};

/** 设置透明度(百分比) */
Node.prototype.setOpacity = function (val: number) {
    if (val < 0 || val > 1) {
        console.error("setOpacity val error", val);
        return;
    }
    let node: Node = this;
    if (!node) {
        return;
    }
    node.opacity = val * 255;
    for (let child of node.children) {
        child.setOpacity(val);
    }
    let sprite: Sprite = node.getComponent(Sprite);
    if (sprite) {
        let color = sprite.color.clone();
        color.a = val * 255;
        sprite.color = color;
    }
    let label: Label = node.getComponent(Label);
    if (label) {
        let color = label.color.clone();
        color.a = val * 255;
        label.color = color;
    }
};

Node.prototype.loadTexture = function (url: string) {
    MyResManager.loadTexture(this, url);
};

Node.prototype.getWidth = function () {
    return this.getContentSize().width;
};

Node.prototype.getHeight = function () {
    return this.getContentSize().height;
};

Node.prototype.getSize = function () {
    return this.getContentSize();
};

Node.prototype.setPositionCC = function (pos: Vec2, zOrder?: number) {
    this.setPosition(pos.x, pos.y, 1);
    if (zOrder != null) {
        this.setLocalZOrder(zOrder);
    }
};

Node.prototype.getPositionCC = function () {
    return new Vec2(this.getPositionX(), this.getPositionY());
};

Node.prototype.getPositionX = function () {
    return this.position.x;
};

Node.prototype.getPositionY = function () {
    return this.position.y;
};

Node.prototype.setPositionX = function (x: number) {
    let pos = this.position;
    pos.x = x;
    this.position = pos;
};

Node.prototype.setPositionY = function (y: number) {
    let pos = this.position;
    pos.y = y;
    this.position = pos;
};

Node.prototype.setLayoutSpacingX = function (val: number) {
    let layout: Layout = this.getComponent(Layout);
    if (!layout) {
        return;
    }
    if (layout.type != Layout.Type.HORIZONTAL) {
        return;
    }
    layout.spacingX = val;
};

Node.prototype.setLayoutSpacingY = function (val: number) {
    let layout: Layout = this.getComponent(Layout);
    if (!layout) {
        return;
    }
    if (layout.type != Layout.Type.VERTICAL) {
        return;
    }
    layout.spacingY = val;
};

Node.prototype.setString = function (str: string) {
    let label: Label = this.getComponent(Label);
    if (label) {
        label.string = str;
    }
    let richText: RichText = this.getComponent(RichText);
    if (richText) {
        richText.string = str;
    }
};

Node.prototype.setLocalZOrder = function (zOrder: number) {
    if (!this.parent) {
        this._zOrder = zOrder;
        return;
    }

    this._zOrder = zOrder;
    let children = this.parent.children;
    let newSibIndex = 0;
    for (let index = 0; index < children.length; index++) {
        let sib = children[index];
        if (this == sib) {
            continue;
        }
        let sibOrder = sib._zOrder;
        if (sibOrder == null || sibOrder == undefined) {
            sibOrder = 0;
        }
        if (sibOrder > zOrder) {
            break;
        }
        ++newSibIndex;
    }

    if (this.getSiblingIndex() != newSibIndex) {
        this.setSiblingIndex(newSibIndex);
    }
};

Node.prototype.setTag = function (tag: string | number) {
    this._tag = tag;
};

Node.prototype.addChildCC = function (
    child: Node,
    zOrder?: number,
    tag?: number | string
) {
    zOrder = zOrder || child._zOrder || 0;
    this.addChild(child);
    child.setLocalZOrder(zOrder);
    if (tag !== undefined) {
        child.setTag(tag);
    }
};

Node.prototype.clone = function (): Node {
    let newNode = instantiate(this);
    return newNode;
};

Node.prototype.addClickListener = function (callback: Function) {
    if (this._clickList == null) {
        this._clickList = [];
        this.on(NodeEventType.TOUCH_START, (event: EventTouch) => {
            if (this._touchEnbale == false) {
                event.preventSwallow = true;
                return;
            }
        });
        this.on(NodeEventType.TOUCH_END, (event: EventTouch) => {
            if (this._touchEnbale == false) {
                event.preventSwallow = true;
                return;
            }
            if (event.target != this) return;
            this._clickList?.forEach((clickInfo) => {
                var _callback = clickInfo.callback;
                if (
                    Vec2.squaredDistance(
                        event.getUILocation(),
                        event.getUIStartLocation()
                    ) > 100
                ) {
                    return;
                }
                _callback(event.currentTarget, NodeEventType.TOUCH_END);
            });
        });
    }
    var clickInfo: any = {
        callback: callback,
    };
    this._clickList.push(clickInfo);
};

Node.prototype.removeTouchListener = function () {
    if (this._clickList) {
        this._clickList.splice(0);
    }
    if (this._touchList) {
        this._touchList.splice(0);
    }
};
