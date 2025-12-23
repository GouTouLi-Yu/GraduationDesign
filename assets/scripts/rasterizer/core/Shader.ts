import { Vertex } from "./Vertex";
import { Vec3 } from "../math/Vec3";
import { Vec4 } from "../math/Vec4";
import { Mat4 } from "../math/Mat4";
import { Color } from "../math/Color";

/**
 * 顶点着色器接口
 */
export interface VertexShader {
    /**
     * 顶点着色器主函数
     * @param vertex 输入顶点
     * @param uniforms 全局变量
     * @returns 输出顶点
     */
    main(vertex: Vertex, uniforms: any): Vertex;
}

/**
 * 片段着色器接口
 */
export interface FragmentShader {
    /**
     * 片段着色器主函数
     * @param vertex 插值后的顶点数据
     * @param uniforms 全局变量
     * @returns 输出颜色
     */
    main(vertex: Vertex, uniforms: any): Color;
}

/**
 * 默认顶点着色器（简单传递）
 */
export class DefaultVertexShader implements VertexShader {
    public main(vertex: Vertex, uniforms: any): Vertex {
        return vertex;
    }
}

/**
 * 默认片段着色器（返回顶点颜色）
 */
export class DefaultFragmentShader implements FragmentShader {
    public main(vertex: Vertex, uniforms: any): Color {
        return vertex.color;
    }
}

/**
 * 基础变换顶点着色器
 */
export class TransformVertexShader implements VertexShader {
    public main(vertex: Vertex, uniforms: { mvpMatrix?: Mat4 }): Vertex {
        const output = vertex.clone();
        
        if (uniforms.mvpMatrix) {
            output.position = uniforms.mvpMatrix.multiplyVec4(vertex.position);
        }
        
        return output;
    }
}

/**
 * 简单光照片段着色器
 */
export class SimpleLightingFragmentShader implements FragmentShader {
    public main(vertex: Vertex, uniforms: { 
        lightDirection?: Vec3,
        lightColor?: Color,
        ambientColor?: Color 
    }): Color {
        const lightDir = uniforms.lightDirection || new Vec3(0, 0, -1);
        const lightColor = uniforms.lightColor || Color.white();
        const ambient = uniforms.ambientColor || new Color(0.2, 0.2, 0.2, 1);

        // 计算漫反射
        const normal = vertex.normal.normalize();
        const dot = Math.max(0, normal.dot(lightDir));
        const diffuse = lightColor.multiplyScalar(dot);

        // 环境光 + 漫反射
        const finalColor = ambient.add(diffuse).multiply(vertex.color);
        
        return finalColor;
    }
}

