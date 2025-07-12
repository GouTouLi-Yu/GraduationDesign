import { ConfigReader } from "../ConfigReader/ConfigReader";

export class Strings {
    static get(str: string, data?: Record<string, any>): string {
        str = ConfigReader.getDataByIdAndKey("Translate", str, "text");
        return this.parseTemplate(str, data);
    }

    // 动态解析
    private static parseTemplate(
        text: string,
        variables: Record<string, any>
    ): string {
        return text.replace(/\$\{(\w+)\}/g, (match, p1) => {
            // 检查变量是否存在
            if (variables?.hasOwnProperty(p1)) {
                return String(variables[p1]); // 转为字符串
            }
            return match; // 不匹配的保持原样
        });
    }
}
