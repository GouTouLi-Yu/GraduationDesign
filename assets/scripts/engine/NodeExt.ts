import { Node } from "cc";

declare module "cc" {
    interface Node {
        [x: string]: any;
        clone(): Node;
    }
}

/** 未完成 */
Node.prototype.clone = function (): Node {
    // return Node.prototype.clone.call(this);
    return new Node();
};
