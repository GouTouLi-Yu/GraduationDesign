import { Mat4, Node, UITransform, Vec2, Vec3 } from "cc";

export class MathHelper {
    /** 某个位置是否在结点中(都按照世界坐标系来算) */
    static isInNodeByWorld(pos: Vec2, node: Node): boolean {
        // 获取节点的UITransform组件
        const uiTransform = node.getComponent(UITransform);
        if (!uiTransform) {
            console.warn("Node has no UITransform component");
            return false;
        }

        // 获取世界矩阵的逆矩阵
        const worldMatrix = node.getWorldMatrix();
        const inverseMatrix = new Mat4();
        Mat4.invert(inverseMatrix, worldMatrix);

        // 将世界坐标转换为节点本地坐标
        const localPos = new Vec3();
        Vec3.transformMat4(localPos, new Vec3(pos.x, pos.y, 1), inverseMatrix);

        // 获取节点的宽高和锚点
        const width = uiTransform.width;
        const height = uiTransform.height;
        const anchorX = uiTransform.anchorX;
        const anchorY = uiTransform.anchorY;

        // 计算节点在本地坐标系中的边界
        const left = -width * anchorX;
        const right = width * (1 - anchorX);
        const bottom = -height * anchorY;
        const top = height * (1 - anchorY);

        // 判断坐标是否在边界内
        return (
            localPos.x >= left &&
            localPos.x <= right &&
            localPos.y >= bottom &&
            localPos.y <= top
        );
    }
}
