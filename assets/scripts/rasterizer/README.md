# 光栅化渲染器使用说明

## 快速开始

### 方法1：使用测试组件（推荐）

1. **在Cocos Creator编辑器中**：
   - 打开任意场景
   - 创建一个新节点（或使用现有节点）
   - 给节点添加 `Sprite` 组件
   - 给节点添加 `RasterizerTest` 组件（脚本路径：`scripts/rasterizer/RasterizerTest`）

2. **配置组件属性**：
   - `sprite`: 绑定Sprite组件（如果节点已有Sprite组件会自动获取）
   - `width`: 渲染宽度（默认800）
   - `height`: 渲染高度（默认600）
   - `enableRotation`: 是否启用自动旋转（默认true）
   - `rotationSpeed`: 旋转速度（默认1.0）

3. **运行游戏**：
   - 点击运行按钮
   - 你将看到一个旋转的彩色三角形和立方体线框

### 方法2：在代码中使用

```typescript
import { RasterizerRenderer } from "./rasterizer/RasterizerRenderer";
import { Vertex } from "./rasterizer/core/Vertex";
import { Vec4 } from "./rasterizer/math/Vec4";
import { Vec3 } from "./rasterizer/math/Vec3";
import { Color } from "./rasterizer/math/Color";
import { TransformVertexShader, SimpleLightingFragmentShader } from "./rasterizer/core/Shader";
import { Mat4 } from "./rasterizer/math/Mat4";

// 创建渲染器
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

// 创建并绘制三角形
const v0 = new Vertex(new Vec4(-1, -1, 0, 1), new Vec3(0, 0, 1), Color.red());
const v1 = new Vertex(new Vec4(1, -1, 0, 1), new Vec3(0, 0, 1), Color.green());
const v2 = new Vertex(new Vec4(0, 1, 0, 1), new Vec3(0, 0, 1), Color.blue());
renderer.drawTriangle(v0, v1, v2);

// 获取渲染结果
const imageData = renderer.getImageData();
```

## 功能特性

- ✅ 三角形光栅化（使用重心坐标插值）
- ✅ 深度缓冲（Z-buffer）
- ✅ 背面剔除
- ✅ 可自定义顶点着色器
- ✅ 可自定义片段着色器
- ✅ 矩阵变换（模型、视图、投影）
- ✅ 简单光照模型
- ✅ 线段绘制（Bresenham算法）

## 文件结构

```
scripts/rasterizer/
├── math/              # 数学库
│   ├── Vec2.ts       # 二维向量
│   ├── Vec3.ts       # 三维向量
│   ├── Vec4.ts       # 四维向量
│   ├── Mat4.ts       # 4x4矩阵
│   └── Color.ts      # 颜色
├── core/              # 核心组件
│   ├── Framebuffer.ts    # 帧缓冲
│   ├── Vertex.ts         # 顶点数据
│   ├── Rasterizer.ts     # 光栅化器
│   └── Shader.ts         # 着色器
├── RasterizerRenderer.ts # 渲染器主类
├── RasterizerTest.ts     # 测试组件
├── example.ts            # 使用示例
├── index.ts              # 导出文件
└── README.md             # 说明文档
```

## 自定义着色器

你可以创建自己的着色器：

```typescript
import { VertexShader, FragmentShader, Vertex, Color } from "./rasterizer";

// 自定义顶点着色器
class MyVertexShader implements VertexShader {
    main(vertex: Vertex, uniforms: any): Vertex {
        // 你的顶点变换逻辑
        return vertex;
    }
}

// 自定义片段着色器
class MyFragmentShader implements FragmentShader {
    main(vertex: Vertex, uniforms: any): Color {
        // 你的像素着色逻辑
        return vertex.color;
    }
}

// 使用自定义着色器
renderer.setVertexShader(new MyVertexShader());
renderer.setFragmentShader(new MyFragmentShader());
```

## 注意事项

1. 渲染器在浏览器环境中运行，需要支持Canvas API
2. 性能取决于渲染的三角形数量和分辨率
3. 当前实现是CPU渲染，不适合大量几何体
4. 纹理映射功能可以后续扩展

## 示例场景

查看 `example.ts` 文件了解更多使用示例，包括：
- 基本三角形渲染
- 立方体线框渲染
- 自定义着色器示例

