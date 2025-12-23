import { Framebuffer } from "./core/Framebuffer";
import { Rasterizer } from "./core/Rasterizer";
import { Vertex } from "./core/Vertex";
import { Vec3 } from "./math/Vec3";
import { Vec4 } from "./math/Vec4";
import { Mat4 } from "./math/Mat4";
import { Color } from "./math/Color";
import { 
    VertexShader, 
    FragmentShader, 
    DefaultVertexShader, 
    DefaultFragmentShader,
    TransformVertexShader,
    SimpleLightingFragmentShader
} from "./core/Shader";

/**
 * 光栅化渲染器主类
 */
export class RasterizerRenderer {
    private framebuffer: Framebuffer;
    private rasterizer: Rasterizer;
    private width: number;
    private height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.framebuffer = new Framebuffer(width, height);
        this.rasterizer = new Rasterizer(this.framebuffer);
        
        // 设置默认着色器
        this.rasterizer.setVertexShader(new DefaultVertexShader());
        this.rasterizer.setFragmentShader(new DefaultFragmentShader());
    }

    /**
     * 设置顶点着色器
     */
    public setVertexShader(shader: VertexShader): void {
        this.rasterizer.setVertexShader(shader);
    }

    /**
     * 设置片段着色器
     */
    public setFragmentShader(shader: FragmentShader): void {
        this.rasterizer.setFragmentShader(shader);
    }

    /**
     * 设置全局变量
     */
    public setUniforms(uniforms: any): void {
        this.rasterizer.setUniforms(uniforms);
    }

    /**
     * 清空帧缓冲
     */
    public clear(color: Color = Color.black()): void {
        this.framebuffer.clear(color);
    }

    /**
     * 绘制三角形
     */
    public drawTriangle(v0: Vertex, v1: Vertex, v2: Vertex): void {
        this.rasterizer.drawTriangle(v0, v1, v2);
    }

    /**
     * 绘制线段
     */
    public drawLine(v0: Vertex, v1: Vertex, color: Color): void {
        this.rasterizer.drawLine(v0, v1, color);
    }

    /**
     * 获取帧缓冲
     */
    public getFramebuffer(): Framebuffer {
        return this.framebuffer;
    }

    /**
     * 获取ImageData（用于Canvas渲染）
     */
    public getImageData(): ImageData {
        return this.framebuffer.toImageData();
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
     * 创建简单的示例场景
     */
    public static createExampleScene(): {
        renderer: RasterizerRenderer,
        vertices: Vertex[]
    } {
        const renderer = new RasterizerRenderer(800, 600);
        
        // 设置变换着色器
        renderer.setVertexShader(new TransformVertexShader());
        renderer.setFragmentShader(new SimpleLightingFragmentShader());

        // 创建模型视图投影矩阵
        const model = Mat4.identity();
        const view = Mat4.lookAt(
            { x: 0, y: 0, z: 5 },
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 1, z: 0 }
        );
        const projection = Mat4.perspective(Math.PI / 4, 800 / 600, 0.1, 100);
        const mvp = projection.multiply(view).multiply(model);

        // 设置全局变量
        renderer.setUniforms({
            mvpMatrix: mvp,
            lightDirection: new Vec3(0, 0, -1).normalize(),
            lightColor: Color.white(),
            ambientColor: new Color(0.2, 0.2, 0.2, 1)
        });

        // 创建一个简单的三角形
        const vertices: Vertex[] = [
            new Vertex(
                new Vec4(-1, -1, 0, 1),
                new Vec3(0, 0, 1),
                Color.red(),
                { u: 0, v: 0 }
            ),
            new Vertex(
                new Vec4(1, -1, 0, 1),
                new Vec3(0, 0, 1),
                Color.green(),
                { u: 1, v: 0 }
            ),
            new Vertex(
                new Vec4(0, 1, 0, 1),
                new Vec3(0, 0, 1),
                Color.blue(),
                { u: 0.5, v: 1 }
            )
        ];

        return { renderer, vertices };
    }
}

