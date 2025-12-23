import { Framebuffer } from "./Framebuffer";
import { Vertex } from "./Vertex";
import { Vec2 } from "../math/Vec2";
import { Vec3 } from "../math/Vec3";
import { Color } from "../math/Color";
import { VertexShader, FragmentShader } from "./Shader";

/**
 * 光栅化器
 */
export class Rasterizer {
    private framebuffer: Framebuffer;
    private vertexShader: VertexShader;
    private fragmentShader: FragmentShader;
    private uniforms: any;

    constructor(framebuffer: Framebuffer) {
        this.framebuffer = framebuffer;
        this.uniforms = {};
    }

    /**
     * 设置顶点着色器
     */
    public setVertexShader(shader: VertexShader): void {
        this.vertexShader = shader;
    }

    /**
     * 设置片段着色器
     */
    public setFragmentShader(shader: FragmentShader): void {
        this.fragmentShader = shader;
    }

    /**
     * 设置全局变量
     */
    public setUniforms(uniforms: any): void {
        this.uniforms = uniforms;
    }

    /**
     * 绘制三角形
     */
    public drawTriangle(v0: Vertex, v1: Vertex, v2: Vertex): void {
        // 顶点着色
        const sv0 = this.vertexShader.main(v0, this.uniforms);
        const sv1 = this.vertexShader.main(v1, this.uniforms);
        const sv2 = this.vertexShader.main(v2, this.uniforms);

        // 透视除法
        const p0 = sv0.position.perspectiveDivide();
        const p1 = sv1.position.perspectiveDivide();
        const p2 = sv2.position.perspectiveDivide();

        // 视口变换（NDC到屏幕坐标）
        const width = this.framebuffer.getWidth();
        const height = this.framebuffer.getHeight();
        
        const screen0 = this.ndcToScreen(p0, width, height);
        const screen1 = this.ndcToScreen(p1, width, height);
        const screen2 = this.ndcToScreen(p2, width, height);

        // 背面剔除（简单的叉积测试）
        if (!this.isFrontFacing(screen0, screen1, screen2)) {
            return;
        }

        // 光栅化三角形
        this.rasterizeTriangle(sv0, sv1, sv2, screen0, screen1, screen2);
    }

    /**
     * NDC坐标转换为屏幕坐标
     */
    private ndcToScreen(ndc: Vec3, width: number, height: number): Vec2 {
        const x = (ndc.x * 0.5 + 0.5) * width;
        const y = (1.0 - (ndc.y * 0.5 + 0.5)) * height; // Y轴翻转
        return new Vec2(x, y);
    }

    /**
     * 判断三角形是否正面朝向
     */
    private isFrontFacing(v0: Vec2, v1: Vec2, v2: Vec2): boolean {
        const edge1 = v1.subtract(v0);
        const edge2 = v2.subtract(v0);
        // 2D叉积（实际上是z分量）
        const cross = edge1.x * edge2.y - edge1.y * edge2.x;
        return cross > 0; // 逆时针为正面
    }

    /**
     * 光栅化三角形（使用重心坐标）
     */
    private rasterizeTriangle(
        v0: Vertex, v1: Vertex, v2: Vertex,
        p0: Vec2, p1: Vec2, p2: Vec2
    ): void {
        // 计算边界框
        const minX = Math.max(0, Math.floor(Math.min(p0.x, p1.x, p2.x)));
        const maxX = Math.min(this.framebuffer.getWidth() - 1, Math.ceil(Math.max(p0.x, p1.x, p2.x)));
        const minY = Math.max(0, Math.floor(Math.min(p0.y, p1.y, p2.y)));
        const maxY = Math.min(this.framebuffer.getHeight() - 1, Math.ceil(Math.max(p0.y, p1.y, p2.y)));

        // 预计算边向量
        const v0v1 = p1.subtract(p0);
        const v0v2 = p2.subtract(p0);
        const v1v2 = p2.subtract(p1);

        // 遍历边界框内的每个像素
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const p = new Vec2(x + 0.5, y + 0.5); // 像素中心

                // 计算重心坐标
                const w0 = this.edgeFunction(p1, p2, p);
                const w1 = this.edgeFunction(p2, p0, p);
                const w2 = this.edgeFunction(p0, p1, p);

                // 检查点是否在三角形内
                if (w0 >= 0 && w1 >= 0 && w2 >= 0) {
                    // 归一化重心坐标
                    const area = this.edgeFunction(p0, p1, p2);
                    if (area === 0) continue;

                    const invArea = 1.0 / area;
                    const bary0 = w0 * invArea;
                    const bary1 = w1 * invArea;
                    const bary2 = w2 * invArea;

                    // 深度插值
                    const depth = v0.position.z * bary0 + v1.position.z * bary1 + v2.position.z * bary2;

                    // 深度测试
                    if (this.framebuffer.depthTest(x, y, depth)) {
                        // 更新深度缓冲
                        this.framebuffer.setDepth(x, y, depth);

                        // 插值顶点属性
                        const interpolated = Vertex.interpolate(v0, v1, v2, bary0, bary1, bary2);

                        // 片段着色
                        const color = this.fragmentShader.main(interpolated, this.uniforms);

                        // 写入帧缓冲
                        this.framebuffer.setPixel(x, y, color);
                    }
                }
            }
        }
    }

    /**
     * 边函数（用于计算重心坐标）
     */
    private edgeFunction(v0: Vec2, v1: Vec2, p: Vec2): number {
        return (p.x - v0.x) * (v1.y - v0.y) - (p.y - v0.y) * (v1.x - v0.x);
    }

    /**
     * 绘制线段（Bresenham算法）
     */
    public drawLine(v0: Vertex, v1: Vertex, color: Color): void {
        const sv0 = this.vertexShader.main(v0, this.uniforms);
        const sv1 = this.vertexShader.main(v1, this.uniforms);

        const p0 = sv0.position.perspectiveDivide();
        const p1 = sv1.position.perspectiveDivide();

        const width = this.framebuffer.getWidth();
        const height = this.framebuffer.getHeight();

        const screen0 = this.ndcToScreen(p0, width, height);
        const screen1 = this.ndcToScreen(p1, width, height);

        this.bresenhamLine(
            Math.floor(screen0.x), Math.floor(screen0.y),
            Math.floor(screen1.x), Math.floor(screen1.y),
            color
        );
    }

    /**
     * Bresenham直线算法
     */
    private bresenhamLine(x0: number, y0: number, x1: number, y1: number, color: Color): void {
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        let x = x0;
        let y = y0;

        while (true) {
            this.framebuffer.setPixel(x, y, color);

            if (x === x1 && y === y1) break;

            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }
    }
}

