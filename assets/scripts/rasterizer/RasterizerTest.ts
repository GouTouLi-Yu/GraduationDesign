import { _decorator, Component, Sprite, SpriteFrame, Texture2D, ImageAsset } from "cc";
import { RasterizerRenderer } from "./RasterizerRenderer";
import { Vertex } from "./core/Vertex";
import { Vec4 } from "./math/Vec4";
import { Vec3 } from "./math/Vec3";
import { Mat4 } from "./math/Mat4";
import { Color } from "./math/Color";
import { TransformVertexShader, SimpleLightingFragmentShader } from "./core/Shader";

const { ccclass, property } = _decorator;

/**
 * 光栅化渲染器测试组件
 * 将此组件添加到场景中的任意节点上，节点需要有Sprite组件
 */
@ccclass("RasterizerTest")
export class RasterizerTest extends Component {
    @property(Sprite)
    sprite: Sprite = null!;

    @property
    width: number = 800;

    @property
    height: number = 600;

    @property
    enableRotation: boolean = true;

    @property
    rotationSpeed: number = 1.0;

    private renderer: RasterizerRenderer | null = null;
    private rotationAngle: number = 0;

    onLoad() {
        // 如果没有指定Sprite，尝试从当前节点获取
        if (!this.sprite) {
            this.sprite = this.getComponent(Sprite);
            if (!this.sprite) {
                console.error("[RasterizerTest] 需要Sprite组件！");
                return;
            }
        }

        // 创建渲染器
        this.renderer = new RasterizerRenderer(this.width, this.height);
        this.renderer.setVertexShader(new TransformVertexShader());
        this.renderer.setFragmentShader(new SimpleLightingFragmentShader());

        // 初始渲染
        this.render();
    }

    start() {
        // 将渲染结果设置到Sprite
        this.updateSprite();
    }

    update(deltaTime: number) {
        if (this.enableRotation) {
            this.rotationAngle += deltaTime * this.rotationSpeed;
            this.render();
            this.updateSprite();
        }
    }

    /**
     * 渲染场景
     */
    private render() {
        if (!this.renderer) return;

        // 清空屏幕
        this.renderer.clear(Color.black());

        // 创建MVP矩阵
        const model = Mat4.rotationY(this.rotationAngle).multiply(Mat4.rotationX(this.rotationAngle * 0.5));
        const view = Mat4.lookAt(
            { x: 0, y: 0, z: 5 },
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 1, z: 0 }
        );
        const aspect = this.width / this.height;
        const projection = Mat4.perspective(Math.PI / 4, aspect, 0.1, 100);
        const mvp = projection.multiply(view).multiply(model);

        // 设置全局变量
        this.renderer.setUniforms({
            mvpMatrix: mvp,
            lightDirection: new Vec3(0.5, 1, -1).normalize(),
            lightColor: Color.white(),
            ambientColor: new Color(0.2, 0.2, 0.2, 1)
        });

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
        this.renderer.drawTriangle(v0, v1, v2);

        // 可以绘制更多三角形组成一个立方体面
        this.drawCube();
    }

    /**
     * 绘制立方体（线框模式）
     */
    private drawCube() {
        if (!this.renderer) return;

        const size = 0.8;
        const vertices = [
            new Vertex(new Vec4(-size, -size, -size, 1), new Vec3(0, 0, -1), Color.white()),
            new Vertex(new Vec4(size, -size, -size, 1), new Vec3(0, 0, -1), Color.white()),
            new Vertex(new Vec4(size, size, -size, 1), new Vec3(0, 0, -1), Color.white()),
            new Vertex(new Vec4(-size, size, -size, 1), new Vec3(0, 0, -1), Color.white()),
            new Vertex(new Vec4(-size, -size, size, 1), new Vec3(0, 0, 1), Color.white()),
            new Vertex(new Vec4(size, -size, size, 1), new Vec3(0, 0, 1), Color.white()),
            new Vertex(new Vec4(size, size, size, 1), new Vec3(0, 0, 1), Color.white()),
            new Vertex(new Vec4(-size, size, size, 1), new Vec3(0, 0, 1), Color.white())
        ];

        // 绘制立方体的12条边
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // 前面
            [4, 5], [5, 6], [6, 7], [7, 4], // 后面
            [0, 4], [1, 5], [2, 6], [3, 7]  // 连接
        ];

        edges.forEach(([i, j]) => {
            this.renderer!.drawLine(vertices[i], vertices[j], Color.white());
        });
    }

    /**
     * 更新Sprite显示
     */
    private updateSprite() {
        if (!this.renderer || !this.sprite) return;

        try {
            const imageData = this.renderer.getImageData();
            
            // 创建ImageAsset - 直接使用ImageData
            const imageAsset = new ImageAsset();
            
            // 将ImageData转换为Uint8Array (RGBA格式)
            const data = new Uint8Array(imageData.data);
            
            // 重置ImageAsset
            imageAsset.reset({
                width: imageData.width,
                height: imageData.height,
                format: Texture2D.PixelFormat.RGBA8888,
                _data: data
            });

            // 创建Texture2D
            const texture = new Texture2D();
            texture.image = imageAsset;
            texture.setFilters(Texture2D.Filter.LINEAR, Texture2D.Filter.LINEAR);

            // 创建SpriteFrame
            const spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;
            spriteFrame.rect = {
                x: 0,
                y: 0,
                width: imageData.width,
                height: imageData.height
            };

            // 设置到Sprite
            this.sprite.spriteFrame = spriteFrame;
        } catch (error) {
            console.error("[RasterizerTest] 更新Sprite失败:", error);
            // 如果直接方法失败，尝试使用Canvas方法（浏览器环境）
            this.updateSpriteWithCanvas();
        }
    }

    /**
     * 使用Canvas更新Sprite（浏览器环境备用方法）
     */
    private updateSpriteWithCanvas() {
        if (!this.renderer || !this.sprite) return;
        
        // 检查是否在浏览器环境
        if (typeof document === 'undefined') {
            console.error("[RasterizerTest] 非浏览器环境，无法使用Canvas");
            return;
        }

        try {
            const imageData = this.renderer.getImageData();
            
            // 使用Canvas创建图像
            const canvas = document.createElement('canvas');
            canvas.width = imageData.width;
            canvas.height = imageData.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error("[RasterizerTest] 无法创建Canvas上下文");
                return;
            }
            ctx.putImageData(imageData, 0, 0);

            // 将Canvas转换为ImageAsset
            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error("[RasterizerTest] Canvas转换失败");
                    return;
                }

                // 创建ImageAsset
                const imageAsset = new ImageAsset();
                const url = URL.createObjectURL(blob);
                
                // 使用Image加载
                const img = new Image();
                img.onload = () => {
                    imageAsset.reset({
                        width: img.width,
                        height: img.height,
                        format: Texture2D.PixelFormat.RGBA8888,
                        _data: img
                    });

                    // 创建Texture2D
                    const texture = new Texture2D();
                    texture.image = imageAsset;

                    // 创建SpriteFrame
                    const spriteFrame = new SpriteFrame();
                    spriteFrame.texture = texture;

                    // 设置到Sprite
                    this.sprite.spriteFrame = spriteFrame;
                    
                    URL.revokeObjectURL(url);
                };
                img.onerror = () => {
                    console.error("[RasterizerTest] 图像加载失败");
                    URL.revokeObjectURL(url);
                };
                img.src = url;
            }, 'image/png');
        } catch (error) {
            console.error("[RasterizerTest] Canvas更新失败:", error);
        }
    }

    /**
     * 手动触发渲染（用于测试）
     */
    public manualRender() {
        this.render();
        this.updateSprite();
    }
}

