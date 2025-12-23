/**
 * 二维向量类
 */
export class Vec2 {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public static zero(): Vec2 {
        return new Vec2(0, 0);
    }

    public static one(): Vec2 {
        return new Vec2(1, 1);
    }

    public clone(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    public add(v: Vec2): Vec2 {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    public subtract(v: Vec2): Vec2 {
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    public multiply(scalar: number): Vec2 {
        return new Vec2(this.x * scalar, this.y * scalar);
    }

    public dot(v: Vec2): number {
        return this.x * v.x + this.y * v.y;
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public normalize(): Vec2 {
        const len = this.length();
        if (len === 0) return new Vec2(0, 0);
        return new Vec2(this.x / len, this.y / len);
    }
}

