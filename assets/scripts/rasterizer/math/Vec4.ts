import { Vec3 } from "./Vec3";

/**
 * 四维向量类
 */
export class Vec4 {
    public x: number;
    public y: number;
    public z: number;
    public w: number;

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    public static zero(): Vec4 {
        return new Vec4(0, 0, 0, 0);
    }

    public static one(): Vec4 {
        return new Vec4(1, 1, 1, 1);
    }

    public clone(): Vec4 {
        return new Vec4(this.x, this.y, this.z, this.w);
    }

    public add(v: Vec4): Vec4 {
        return new Vec4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
    }

    public subtract(v: Vec4): Vec4 {
        return new Vec4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
    }

    public multiply(scalar: number): Vec4 {
        return new Vec4(this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar);
    }

    public dot(v: Vec4): number {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }

    public normalize(): Vec4 {
        const len = this.length();
        if (len === 0) return new Vec4(0, 0, 0, 0);
        return new Vec4(this.x / len, this.y / len, this.z / len, this.w / len);
    }

    /**
     * 透视除法：将齐次坐标转换为3D坐标
     */
    public perspectiveDivide(): Vec3 {
        if (this.w === 0) return new Vec3(this.x, this.y, this.z);
        return new Vec3(this.x / this.w, this.y / this.w, this.z / this.w);
    }

    public toVec3(): Vec3 {
        return new Vec3(this.x, this.y, this.z);
    }
}

