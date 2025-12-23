import { Color } from "../math/Color";

/**
 * 帧缓冲类
 */
export class Framebuffer {
    private width: number;
    private height: number;
    private colorBuffer: Uint32Array;
    private depthBuffer: Float32Array;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.colorBuffer = new Uint32Array(width * height);
        this.depthBuffer = new Float32Array(width * height);
        this.clear();
    }

    /**
     * 清空帧缓冲
     */
    public clear(color: Color = Color.black()): void {
        const colorInt = color.toInt32();
        for (let i = 0; i < this.colorBuffer.length; i++) {
            this.colorBuffer[i] = colorInt;
        }
        // 深度缓冲初始化为最大值
        for (let i = 0; i < this.depthBuffer.length; i++) {
            this.depthBuffer[i] = 1.0;
        }
    }

    /**
     * 设置像素颜色
     */
    public setPixel(x: number, y: number, color: Color): void {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return;
        }
        const index = y * this.width + x;
        this.colorBuffer[index] = color.toInt32();
    }

    /**
     * 获取像素颜色
     */
    public getPixel(x: number, y: number): Color {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return Color.black();
        }
        const index = y * this.width + x;
        return Color.fromInt32(this.colorBuffer[index]);
    }

    /**
     * 设置深度值
     */
    public setDepth(x: number, y: number, depth: number): void {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return;
        }
        const index = y * this.width + x;
        this.depthBuffer[index] = depth;
    }

    /**
     * 获取深度值
     */
    public getDepth(x: number, y: number): number {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return 1.0;
        }
        const index = y * this.width + x;
        return this.depthBuffer[index];
    }

    /**
     * 深度测试
     */
    public depthTest(x: number, y: number, depth: number): boolean {
        // 使用小于等于，允许相同深度的像素通过
        return depth <= this.getDepth(x, y);
    }

    /**
     * 获取颜色缓冲区的原始数据
     */
    public getColorBuffer(): Uint32Array {
        return this.colorBuffer;
    }

    /**
     * 获取宽度
     */
    public getWidth(): number {
        return this.width;
    }

    /**
     * 获取高度
     */
    public getHeight(): number {
        return this.height;
    }

    /**
     * 将帧缓冲转换为ImageData（用于Canvas渲染）
     */
    public toImageData(): ImageData {
        const imageData = new ImageData(this.width, this.height);
        const data = imageData.data;
        
        for (let i = 0; i < this.colorBuffer.length; i++) {
            const color = this.colorBuffer[i];
            const offset = i * 4;
            // ARGB to RGBA
            data[offset] = (color >> 16) & 0xFF;     // R
            data[offset + 1] = (color >> 8) & 0xFF;  // G
            data[offset + 2] = color & 0xFF;         // B
            data[offset + 3] = (color >> 24) & 0xFF; // A
        }
        
        return imageData;
    }
}

