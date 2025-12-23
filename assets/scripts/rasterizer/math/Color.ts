/**
 * 颜色类（RGBA）
 */
export class Color {
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
        this.r = Math.max(0, Math.min(1, r));
        this.g = Math.max(0, Math.min(1, g));
        this.b = Math.max(0, Math.min(1, b));
        this.a = Math.max(0, Math.min(1, a));
    }

    public static black(): Color {
        return new Color(0, 0, 0, 1);
    }

    public static white(): Color {
        return new Color(1, 1, 1, 1);
    }

    public static red(): Color {
        return new Color(1, 0, 0, 1);
    }

    public static green(): Color {
        return new Color(0, 1, 0, 1);
    }

    public static blue(): Color {
        return new Color(0, 0, 1, 1);
    }

    public clone(): Color {
        return new Color(this.r, this.g, this.b, this.a);
    }

    public multiply(other: Color): Color {
        return new Color(
            this.r * other.r,
            this.g * other.g,
            this.b * other.b,
            this.a * other.a
        );
    }

    public multiplyScalar(scalar: number): Color {
        return new Color(
            this.r * scalar,
            this.g * scalar,
            this.b * scalar,
            this.a
        );
    }

    public add(other: Color): Color {
        return new Color(
            Math.min(1, this.r + other.r),
            Math.min(1, this.g + other.g),
            Math.min(1, this.b + other.b),
            Math.min(1, this.a + other.a)
        );
    }

    /**
     * 转换为32位整数（ARGB格式）
     */
    public toInt32(): number {
        const r = Math.floor(this.r * 255);
        const g = Math.floor(this.g * 255);
        const b = Math.floor(this.b * 255);
        const a = Math.floor(this.a * 255);
        return (a << 24) | (r << 16) | (g << 8) | b;
    }

    /**
     * 从32位整数创建颜色
     */
    public static fromInt32(value: number): Color {
        const a = ((value >> 24) & 0xFF) / 255;
        const r = ((value >> 16) & 0xFF) / 255;
        const g = ((value >> 8) & 0xFF) / 255;
        const b = (value & 0xFF) / 255;
        return new Color(r, g, b, a);
    }
}

