import { Vec4 } from "./Vec4";

/**
 * 三维向量类
 */
export class Vec3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public static zero(): Vec3 {
        return new Vec3(0, 0, 0);
    }

    public static one(): Vec3 {
        return new Vec3(1, 1, 1);
    }

    public clone(): Vec3 {
        return new Vec3(this.x, this.y, this.z);
    }

    public add(v: Vec3): Vec3 {
        return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    public subtract(v: Vec3): Vec3 {
        return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    public multiply(scalar: number): Vec3 {
        return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    public dot(v: Vec3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    public cross(v: Vec3): Vec3 {
        return new Vec3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public normalize(): Vec3 {
        const len = this.length();
        if (len === 0) return new Vec3(0, 0, 0);
        return new Vec3(this.x / len, this.y / len, this.z / len);
    }

    public toVec4(w: number = 1): Vec4 {
        return new Vec4(this.x, this.y, this.z, w);
    }
}

