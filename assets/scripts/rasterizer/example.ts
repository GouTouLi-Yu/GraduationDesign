/**
 * 光栅化渲染器使用示例
 * 
 * 这个文件展示了如何使用光栅化渲染器
 */

import { RasterizerRenderer } from "./RasterizerRenderer";
import { Vertex } from "./core/Vertex";
import { Vec4 } from "./math/Vec4";
import { Vec3 } from "./math/Vec3";
import { Mat4 } from "./math/Mat4";
import { Color } from "./math/Color";
import { TransformVertexShader, SimpleLightingFragmentShader } from "./core/Shader";

/**
 * 基本使用示例
 */
export function basicExample(): RasterizerRenderer {
    // 创建渲染器（800x600分辨率）
    const renderer = new RasterizerRenderer(800, 600);

    // 设置着色器
    renderer.setVertexShader(new TransformVertexShader());
    renderer.setFragmentShader(new SimpleLightingFragmentShader());

    // 创建MVP矩阵
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

    // 清空屏幕
    renderer.clear(Color.black());

    // 创建一个彩色三角形
    const v0 = new Vertex(
        new Vec4(-1, -1, 0, 1),
        new Vec3(0, 0, 1),
        Color.red()
    );
    const v1 = new Vertex(
        new Vec4(1, -1, 0, 1),
        new Vec3(0, 0, 1),
        Color.green()
    );
    const v2 = new Vertex(
        new Vec4(0, 1, 0, 1),
        new Vec3(0, 0, 1),
        Color.blue()
    );

    // 绘制三角形
    renderer.drawTriangle(v0, v1, v2);

    return renderer;
}

/**
 * 绘制立方体示例（线框模式）
 */
export function cubeExample(): RasterizerRenderer {
    const renderer = new RasterizerRenderer(800, 600);
    renderer.setVertexShader(new TransformVertexShader());
    renderer.setFragmentShader(new SimpleLightingFragmentShader());

    // 设置变换矩阵
    const model = Mat4.rotationY(Math.PI / 4).multiply(Mat4.rotationX(Math.PI / 6));
    const view = Mat4.lookAt(
        { x: 3, y: 3, z: 3 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 }
    );
    const projection = Mat4.perspective(Math.PI / 4, 800 / 600, 0.1, 100);
    const mvp = projection.multiply(view).multiply(model);

    renderer.setUniforms({
        mvpMatrix: mvp,
        lightDirection: new Vec3(0.5, 1, -1).normalize(),
        lightColor: Color.white(),
        ambientColor: new Color(0.1, 0.1, 0.1, 1)
    });

    renderer.clear(Color.black());

    // 立方体的8个顶点
    const size = 1;
    const vertices = [
        new Vertex(new Vec4(-size, -size, -size, 1), new Vec3(0, 0, -1), Color.red()),
        new Vertex(new Vec4(size, -size, -size, 1), new Vec3(0, 0, -1), Color.green()),
        new Vertex(new Vec4(size, size, -size, 1), new Vec3(0, 0, -1), Color.blue()),
        new Vertex(new Vec4(-size, size, -size, 1), new Vec3(0, 0, -1), Color.white()),
        new Vertex(new Vec4(-size, -size, size, 1), new Vec3(0, 0, 1), Color.red()),
        new Vertex(new Vec4(size, -size, size, 1), new Vec3(0, 0, 1), Color.green()),
        new Vertex(new Vec4(size, size, size, 1), new Vec3(0, 0, 1), Color.blue()),
        new Vertex(new Vec4(-size, size, size, 1), new Vec3(0, 0, 1), Color.white())
    ];

    // 绘制立方体的12条边
    const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // 前面
        [4, 5], [5, 6], [6, 7], [7, 4], // 后面
        [0, 4], [1, 5], [2, 6], [3, 7]  // 连接
    ];

    edges.forEach(([i, j]) => {
        renderer.drawLine(vertices[i], vertices[j], Color.white());
    });

    return renderer;
}

/**
 * 在Canvas上渲染
 */
export function renderToCanvas(renderer: RasterizerRenderer, canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = renderer.getWidth();
    canvas.height = renderer.getHeight();

    const imageData = renderer.getImageData();
    ctx.putImageData(imageData, 0, 0);
}

