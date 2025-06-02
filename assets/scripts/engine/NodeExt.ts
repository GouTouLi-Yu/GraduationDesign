import { EventTouch, instantiate, Node, NodeEventType, Vec2 } from "cc";

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
    }
}

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
