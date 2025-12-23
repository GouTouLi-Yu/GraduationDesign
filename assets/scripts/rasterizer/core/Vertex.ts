import { Vec3 } from "../math/Vec3";
import { Vec4 } from "../math/Vec4";
import { Color } from "../math/Color";

/**
 * 顶点数据结构
 */
export class Vertex {
    public position: Vec4;      // 位置（齐次坐标）
    public normal: Vec3;        // 法线
    public color: Color;        // 颜色
    public uv: { u: number, v: number }; // 纹理坐标

    constructor(
        position: Vec4 = new Vec4(),
        normal: Vec3 = new Vec3(0, 0, 1),
        color: Color = Color.white(),
        uv: { u: number, v: number } = { u: 0, v: 0 }
    ) {
        this.position = position;
        this.normal = normal;
        this.color = color;
        this.uv = uv;
    }

    public clone(): Vertex {
        return new Vertex(
            this.position.clone(),
            this.normal.clone(),
            this.color.clone(),
            { u: this.uv.u, v: this.uv.v }
        );
    }

    /**
     * 顶点插值
     */
    public static interpolate(v0: Vertex, v1: Vertex, v2: Vertex, w0: number, w1: number, w2: number): Vertex {
        const pos = new Vec4(
            v0.position.x * w0 + v1.position.x * w1 + v2.position.x * w2,
            v0.position.y * w0 + v1.position.y * w1 + v2.position.y * w2,
            v0.position.z * w0 + v1.position.z * w1 + v2.position.z * w2,
            v0.position.w * w0 + v1.position.w * w1 + v2.position.w * w2
        );

        const normal = new Vec3(
            v0.normal.x * w0 + v1.normal.x * w1 + v2.normal.x * w2,
            v0.normal.y * w0 + v1.normal.y * w1 + v2.normal.y * w2,
            v0.normal.z * w0 + v1.normal.z * w1 + v2.normal.z * w2
        ).normalize();

        const color = new Color(
            v0.color.r * w0 + v1.color.r * w1 + v2.color.r * w2,
            v0.color.g * w0 + v1.color.g * w1 + v2.color.g * w2,
            v0.color.b * w0 + v1.color.b * w1 + v2.color.b * w2,
            v0.color.a * w0 + v1.color.a * w1 + v2.color.a * w2
        );

        const uv = {
            u: v0.uv.u * w0 + v1.uv.u * w1 + v2.uv.u * w2,
            v: v0.uv.v * w0 + v1.uv.v * w1 + v2.uv.v * w2
        };

        return new Vertex(pos, normal, color, uv);
    }
}

