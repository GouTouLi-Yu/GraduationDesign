import { Node } from "cc";

declare module "cc" {
    interface Node {
        // [x: string]: any;
        clone(): Node;
        addChildCC(child: Node, zOrder?: number, tag?: string | number);
        _zOrder: number | null;
        setLocalZOrder(zorder: number);
        setTag(tag: string | number);
        _tag: string | number;
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
