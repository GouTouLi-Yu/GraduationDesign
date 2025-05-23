"use strict";
import * as fs from "fs";
import * as path from "path";
import * as xlsx from "xlsx";

interface ExcelConverter {
    parseValue(
        value: any,
        type: string,
        context: { row: number; field: string }
    ): any;
    convertSheetToTypedJson(sheet: any, filename: string): any[];
    convertExcelToJson(): void;
    cleanDirectory(dir: string, ext: string): void;
    validateType(
        value: any,
        type: string,
        context: { row: number; field: string }
    ): void;
}

const excelConverter: ExcelConverter = {
    cleanDirectory(dir: string, ext: string): void {
        if (!fs.existsSync(dir)) return;

        const files = fs.readdirSync(dir);
        files.forEach((file) => {
            if (file.endsWith(ext)) {
                const filePath = path.join(dir, file);
                fs.unlinkSync(filePath); // 删除文件
                console.log(`[Clean] Deleted: ${filePath}`);
            }
        });
    },

    validateType(
        value: any,
        type: string,
        context: { row: number; field: string }
    ): void {
        if (value === undefined || value === null || value === "") {
            return;
        }

        if (type.endsWith("[]")) {
            if (typeof value !== "string") {
                throw new Error(
                    `Expected array (string) but got ${typeof value}`
                );
            }
            return;
        }

        switch (type) {
            case "int":
            case "number":
                if (isNaN(Number(value))) {
                    throw new Error(`Expected number but got "${value}"`);
                }
                break;
            case "boolean":
                if (typeof value === "string") {
                    const lower = value.toLowerCase();
                    if (lower !== "true" && lower !== "false") {
                        throw new Error(
                            `Expected boolean (true/false) but got "${value}"`
                        );
                    }
                } else if (typeof value !== "boolean") {
                    throw new Error(`Expected boolean but got ${typeof value}`);
                }
                break;
            case "json":
                try {
                    const parsed =
                        typeof value === "string" ? JSON.parse(value) : value;
                    if (typeof parsed !== "object" || parsed === null) {
                        throw new Error(
                            `Expected JSON object but got ${typeof parsed}`
                        );
                    }
                } catch (e) {
                    throw new Error(`Invalid JSON: ${value}`);
                }
                break;
            case "date":
                const date = new Date(value);
                if (isNaN(date.getTime())) {
                    throw new Error(`Invalid date format: "${value}"`);
                }
                break;
            // Add more type validations as needed
        }
    },

    parseValue(
        value: any,
        type: string,
        context: { row: number; field: string }
    ): any {
        if (value === undefined || value === null || value === "") {
            return null;
        }

        // Validate type first
        this.validateType(value, type, context);

        // Handle array types
        if (type.endsWith("[]")) {
            const elementType = type.replace("[]", "");
            const trimmedValue = value.trim();

            if (trimmedValue === "[]" || trimmedValue === "") return [];

            try {
                // Try to parse as JSON array
                const parsed = JSON.parse(trimmedValue);
                if (Array.isArray(parsed)) {
                    return parsed.map((item, index) =>
                        this.parseValue(item, elementType, {
                            row: context.row,
                            field: `${context.field}[${index}]`,
                        })
                    );
                }
                return [
                    this.parseValue(parsed, elementType, {
                        row: context.row,
                        field: `${context.field}[0]`,
                    }),
                ];
            } catch (e) {
                // Fallback to comma-separated values
                const items = trimmedValue.split(",").map((s: any) => s.trim());
                return items.map((item: any, index: any) =>
                    this.parseValue(item, elementType, {
                        row: context.row,
                        field: `${context.field}[${index}]`,
                    })
                );
            }
        }

        // Handle basic types
        switch (type) {
            case "int":
            case "number":
                return Number(value);
            case "string":
                return String(value);
            case "boolean":
                if (typeof value === "string") {
                    return value.toLowerCase() === "true";
                }
                return Boolean(value);
            case "json":
                return typeof value === "string" ? JSON.parse(value) : value;
            case "date":
                return new Date(value).toISOString();
            default:
                return value;
        }
    },

    convertSheetToTypedJson(sheet: any, filename: string): any[] {
        const excelData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        if (excelData.length < 3) return [];

        const typeDefs: any = excelData[0]; // 第一行：数据类型
        const fieldNames: any = excelData[1]; // 第二行：字段名
        const result = [];
        const errors: string[] = [];

        // 从第三行开始解析数据
        for (let i = 2; i < excelData.length; i++) {
            const row: any = excelData[i];
            const obj: any = {};

            for (let j = 0; j < fieldNames.length; j++) {
                const fieldName = fieldNames[j];
                if (!fieldName) continue;

                const fieldType = typeDefs[j] || "string";
                const rawValue = row[j];

                try {
                    obj[fieldName] = this.parseValue(rawValue, fieldType, {
                        row: i + 1, // Excel行号从1开始
                        field: fieldName,
                    });
                } catch (error: any) {
                    errors.push(
                        `[${filename}] 行 ${i + 1}, 列 "${fieldName}": ${
                            error.message
                        }\n` +
                            `类型: ${fieldType}, 值: ${JSON.stringify(
                                rawValue
                            )}`
                    );
                }
            }

            if (Object.keys(obj).length > 0) {
                result.push(obj);
            }
        }

        if (errors.length > 0) {
            throw new Error(
                `发现 ${errors.length} 个类型错误:\n${errors.join("\n\n")}`
            );
        }

        return result;
    },

    convertExcelToJson(): void {
        try {
            console.log("[ExcelConverter] Starting conversion");

            const excelDir =
                "D:\\workAndStudy\\CocosCreator\\FormalProject\\res\\data";
            const outputDir = path.join(
                Editor.Project.path,
                "assets",
                "resources",
                "config"
            );

            if (!fs.existsSync(excelDir)) {
                fs.mkdirSync(excelDir, { recursive: true });
                Editor.Dialog.info(`Created excel directory: ${excelDir}`);
                return;
            }

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            this.cleanDirectory(outputDir, ".json");

            const files = fs
                .readdirSync(excelDir)
                .filter((file) => path.extname(file).toLowerCase() === ".xlsx");

            if (files.length === 0) {
                Editor.Dialog.info(
                    "[ExcelConverter] No .xlsx files found in: " + excelDir
                );
                return;
            }

            let successCount = 0;
            const failedFiles: string[] = [];
            const allErrors: string[] = [];

            for (const file of files) {
                try {
                    const excelPath = path.join(excelDir, file);
                    const jsonName = path.basename(file, ".xlsx") + ".json";
                    const jsonPath = path.join(outputDir, jsonName);

                    const workbook = xlsx.readFile(excelPath);
                    const sheetNames = workbook.SheetNames;

                    if (sheetNames.length === 0) {
                        throw new Error("No worksheets found");
                    }

                    const data = this.convertSheetToTypedJson(
                        workbook.Sheets[sheetNames[0]],
                        file
                    );
                    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
                    successCount++;

                    console.log(
                        `[ExcelConverter] Success: ${file} -> ${jsonName}`
                    );
                } catch (error: any) {
                    failedFiles.push(file);
                    allErrors.push(`${file}: ${error.message}`);
                    console.error(`[ExcelConverter] Failed: ${file}`, error);
                }
            }

            let report = `[ExcelConverter] 转换完成!\n\n成功: ${successCount}\n失败: ${failedFiles.length}`;
            if (allErrors.length > 0) {
                report += `\n\n错误详情:\n${allErrors.join("\n\n")}`;
            }

            if (failedFiles.length > 0) {
                Editor.Dialog.error("[ExcelConverter] 转换出错" + report);
            } else {
                Editor.Dialog.info("[ExcelConverter] 转换完成" + report);
            }
        } catch (error: any) {
            console.error("[ExcelConverter] Global error:", error);
            Editor.Dialog.error("[ExcelConverter] 错误", error.message);
        }
    },
};

export const methods = {
    execute: async function () {
        console.log("[ExcelConverter] Executing...");
        excelConverter.convertExcelToJson();
        return true;
    },
};

export function load() {}
export function unload() {}
