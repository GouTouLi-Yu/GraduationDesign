"use strict";
import * as fs from "fs";
import * as path from "path";
import * as xlsx from "xlsx";

interface ExcelConverter {
    parseValue(value: any, type: string): any;
    convertSheetToTypedJson(sheet: any): any[];
    convertExcelToJson(): void;
    cleanDirectory(dir: string, ext: string): void;
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

    parseValue(value: any, type: string): any {
        if (value === undefined || value === null || value === "") {
            return null;
        }

        // Handle array types
        if (type.endsWith("[]")) {
            if (typeof value !== "string") return [];

            const elementType = type.replace("[]", "");
            const trimmedValue = value.trim();

            if (trimmedValue === "[]" || trimmedValue === "") return [];

            try {
                // Try to parse as JSON array
                const parsed = JSON.parse(trimmedValue);
                if (Array.isArray(parsed)) {
                    return parsed.map((item) =>
                        this.parseValue(item, elementType)
                    );
                }
                return [this.parseValue(parsed, elementType)];
            } catch (e) {
                // Fallback to comma-separated values
                const items = trimmedValue.split(",").map((s) => s.trim());
                return items.map((item) => this.parseValue(item, elementType));
            }
        }

        // Handle basic types
        switch (type) {
            case "int":
            case "number":
                return Number(value);
            case "string":
                return String(value);
            case "json":
                try {
                    return typeof value === "string"
                        ? JSON.parse(value)
                        : value;
                } catch (e) {
                    console.warn(`Failed to parse JSON: ${value}`);
                    return null;
                }
            default:
                return value;
        }
    },

    convertSheetToTypedJson(sheet: any): any[] {
        const excelData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        if (excelData.length < 3) return [];

        const typeDefs: any = excelData[0]; // 第一行：数据类型（string/number/json/json[]/number[]）
        const fieldNames: any = excelData[1]; // 第二行：字段名（Id/type/jsonA/jsonArr/numberArr）
        const result = [];

        // 从第三行开始解析数据
        for (let i = 2; i < excelData.length; i++) {
            const row: any = excelData[i];
            const obj: any = {};

            for (let j = 0; j < fieldNames.length; j++) {
                const fieldName = fieldNames[j];
                if (!fieldName) continue;

                const fieldType = typeDefs[j] || "string";
                const rawValue = row[j];

                obj[fieldName] = this.parseValue(rawValue, fieldType);
            }

            result.push(obj);
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

            for (const file of files) {
                try {
                    const excelPath = path.join(excelDir, file);
                    const jsonName = path.basename(file, ".xlsx") + ".json";
                    const jsonPath = path.join(outputDir, jsonName);

                    const workbook = xlsx.readFile(excelPath);
                    const sheetNames = workbook.SheetNames;

                    if (sheetNames.length === 0) {
                        failedFiles.push(`${file} (no worksheets)`);
                        continue;
                    }

                    const data = this.convertSheetToTypedJson(
                        workbook.Sheets[sheetNames[0]]
                    );
                    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
                    successCount++;

                    console.log(
                        `[ExcelConverter] Success: ${file} -> ${jsonName}`
                    );
                } catch (error: any) {
                    failedFiles.push(`${file} (${error.message})`);
                    console.error(`[ExcelConverter] Failed: ${file}`, error);
                }
            }

            let report = `[ExcelConverter] Conversion complete!\n\nSuccess: ${successCount}\nFailed: ${failedFiles.length}`;
            if (failedFiles.length > 0) {
                report += `\n\nFailed files:\n${failedFiles.join("\n")}`;
            }

            Editor.Dialog.info(report);
        } catch (error: any) {
            console.error("[ExcelConverter] Global error:", error);
            Editor.Dialog.error("[ExcelConverter] Error", error.message);
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
