import { Vec4 } from "./Vec4";

/**
 * 4x4矩阵类
 */
export class Mat4 {
    private m: number[];

    constructor() {
        this.m = new Array(16).fill(0);
        this.identity();
    }

    /**
     * 单位矩阵
     */
    public identity(): Mat4 {
        this.m = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
        return this;
    }

    /**
     * 获取矩阵元素
     */
    public get(row: number, col: number): number {
        return this.m[row * 4 + col];
    }

    /**
     * 设置矩阵元素
     */
    public set(row: number, col: number, value: number): void {
        this.m[row * 4 + col] = value;
    }

    /**
     * 矩阵乘法
     */
    public multiply(other: Mat4): Mat4 {
        const result = new Mat4();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let sum = 0;
                for (let k = 0; k < 4; k++) {
                    sum += this.get(i, k) * other.get(k, j);
                }
                result.set(i, j, sum);
            }
        }
        return result;
    }

    /**
     * 矩阵与向量相乘
     */
    public multiplyVec4(v: Vec4): Vec4 {
        return new Vec4(
            this.get(0, 0) * v.x + this.get(0, 1) * v.y + this.get(0, 2) * v.z + this.get(0, 3) * v.w,
            this.get(1, 0) * v.x + this.get(1, 1) * v.y + this.get(1, 2) * v.z + this.get(1, 3) * v.w,
            this.get(2, 0) * v.x + this.get(2, 1) * v.y + this.get(2, 2) * v.z + this.get(2, 3) * v.w,
            this.get(3, 0) * v.x + this.get(3, 1) * v.y + this.get(3, 2) * v.z + this.get(3, 3) * v.w
        );
    }

    /**
     * 创建平移矩阵
     */
    public static translation(x: number, y: number, z: number): Mat4 {
        const m = new Mat4();
        m.set(0, 3, x);
        m.set(1, 3, y);
        m.set(2, 3, z);
        return m;
    }

    /**
     * 创建缩放矩阵
     */
    public static scaling(x: number, y: number, z: number): Mat4 {
        const m = new Mat4();
        m.set(0, 0, x);
        m.set(1, 1, y);
        m.set(2, 2, z);
        return m;
    }

    /**
     * 创建绕X轴旋转矩阵
     */
    public static rotationX(angle: number): Mat4 {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const m = new Mat4();
        m.set(1, 1, c);
        m.set(1, 2, -s);
        m.set(2, 1, s);
        m.set(2, 2, c);
        return m;
    }

    /**
     * 创建绕Y轴旋转矩阵
     */
    public static rotationY(angle: number): Mat4 {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const m = new Mat4();
        m.set(0, 0, c);
        m.set(0, 2, s);
        m.set(2, 0, -s);
        m.set(2, 2, c);
        return m;
    }

    /**
     * 创建绕Z轴旋转矩阵
     */
    public static rotationZ(angle: number): Mat4 {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const m = new Mat4();
        m.set(0, 0, c);
        m.set(0, 1, -s);
        m.set(1, 0, s);
        m.set(1, 1, c);
        return m;
    }

    /**
     * 创建透视投影矩阵
     */
    public static perspective(fov: number, aspect: number, near: number, far: number): Mat4 {
        const f = 1.0 / Math.tan(fov / 2);
        const range = far - near;
        const m = new Mat4();
        m.set(0, 0, f / aspect);
        m.set(1, 1, f);
        m.set(2, 2, -(far + near) / range);
        m.set(2, 3, -2 * far * near / range);
        m.set(3, 2, -1);
        m.set(3, 3, 0);
        return m;
    }

    /**
     * 创建正交投影矩阵
     */
    public static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4 {
        const m = new Mat4();
        m.set(0, 0, 2 / (right - left));
        m.set(1, 1, 2 / (top - bottom));
        m.set(2, 2, -2 / (far - near));
        m.set(0, 3, -(right + left) / (right - left));
        m.set(1, 3, -(top + bottom) / (top - bottom));
        m.set(2, 3, -(far + near) / (far - near));
        return m;
    }

    /**
     * 创建观察矩阵（LookAt）
     */
    public static lookAt(eye: { x: number, y: number, z: number }, 
                        target: { x: number, y: number, z: number }, 
                        up: { x: number, y: number, z: number }): Mat4 {
        const zAxis = {
            x: eye.x - target.x,
            y: eye.y - target.y,
            z: eye.z - target.z
        };
        const len = Math.sqrt(zAxis.x * zAxis.x + zAxis.y * zAxis.y + zAxis.z * zAxis.z);
        zAxis.x /= len;
        zAxis.y /= len;
        zAxis.z /= len;

        const xAxis = {
            x: up.y * zAxis.z - up.z * zAxis.y,
            y: up.z * zAxis.x - up.x * zAxis.z,
            z: up.x * zAxis.y - up.y * zAxis.x
        };
        const xLen = Math.sqrt(xAxis.x * xAxis.x + xAxis.y * xAxis.y + xAxis.z * xAxis.z);
        xAxis.x /= xLen;
        xAxis.y /= xLen;
        xAxis.z /= xLen;

        const yAxis = {
            x: zAxis.y * xAxis.z - zAxis.z * xAxis.y,
            y: zAxis.z * xAxis.x - zAxis.x * xAxis.z,
            z: zAxis.x * xAxis.y - zAxis.y * xAxis.x
        };

        const m = new Mat4();
        m.set(0, 0, xAxis.x);
        m.set(1, 0, xAxis.y);
        m.set(2, 0, xAxis.z);
        m.set(0, 1, yAxis.x);
        m.set(1, 1, yAxis.y);
        m.set(2, 1, yAxis.z);
        m.set(0, 2, zAxis.x);
        m.set(1, 2, zAxis.y);
        m.set(2, 2, zAxis.z);
        m.set(0, 3, eye.x);
        m.set(1, 3, eye.y);
        m.set(2, 3, eye.z);
        m.set(3, 3, 1);

        return m;
    }

    public clone(): Mat4 {
        const result = new Mat4();
        result.m = [...this.m];
        return result;
    }
}

