"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const xlsx = __importStar(require("xlsx"));
const excelConverter = {
    cleanDirectory(dir, ext) {
        if (!fs.existsSync(dir))
            return;
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
            if (file.endsWith(ext)) {
                const filePath = path.join(dir, file);
                fs.unlinkSync(filePath); // 删除文件
                console.log(`[Clean] Deleted: ${filePath}`);
            }
        });
    },
    parseValue(value, type) {
        if (value === undefined || value === null || value === "") {
            return null;
        }
        // Handle array types
        if (type.endsWith("[]")) {
            if (typeof value !== "string")
                return [];
            const elementType = type.replace("[]", "");
            const trimmedValue = value.trim();
            if (trimmedValue === "[]" || trimmedValue === "")
                return [];
            try {
                // Try to parse as JSON array
                const parsed = JSON.parse(trimmedValue);
                if (Array.isArray(parsed)) {
                    return parsed.map((item) => this.parseValue(item, elementType));
                }
                return [this.parseValue(parsed, elementType)];
            }
            catch (e) {
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
                }
                catch (e) {
                    console.warn(`Failed to parse JSON: ${value}`);
                    return null;
                }
            default:
                return value;
        }
    },
    convertSheetToTypedJson(sheet) {
        const excelData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        if (excelData.length < 3)
            return [];
        const typeDefs = excelData[0]; // 第一行：数据类型（string/number/json/json[]/number[]）
        const fieldNames = excelData[1]; // 第二行：字段名（Id/type/jsonA/jsonArr/numberArr）
        const result = [];
        // 从第三行开始解析数据
        for (let i = 2; i < excelData.length; i++) {
            const row = excelData[i];
            const obj = {};
            for (let j = 0; j < fieldNames.length; j++) {
                const fieldName = fieldNames[j];
                if (!fieldName)
                    continue;
                const fieldType = typeDefs[j] || "string";
                const rawValue = row[j];
                obj[fieldName] = this.parseValue(rawValue, fieldType);
            }
            result.push(obj);
        }
        return result;
    },
    convertExcelToJson() {
        try {
            console.log("[ExcelConverter] Starting conversion");
            const excelDir = "D:\\workAndStudy\\CocosCreator\\FormalProject\\res\\data";
            const outputDir = path.join(Editor.Project.path, "assets", "resources", "config");
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
                Editor.Dialog.info("[ExcelConverter] No .xlsx files found in: " + excelDir);
                return;
            }
            let successCount = 0;
            const failedFiles = [];
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
                    const data = this.convertSheetToTypedJson(workbook.Sheets[sheetNames[0]]);
                    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
                    successCount++;
                    console.log(`[ExcelConverter] Success: ${file} -> ${jsonName}`);
                }
                catch (error) {
                    failedFiles.push(`${file} (${error.message})`);
                    console.error(`[ExcelConverter] Failed: ${file}`, error);
                }
            }
            let report = `[ExcelConverter] Conversion complete!\n\nSuccess: ${successCount}\nFailed: ${failedFiles.length}`;
            if (failedFiles.length > 0) {
                report += `\n\nFailed files:\n${failedFiles.join("\n")}`;
            }
            Editor.Dialog.info(report);
        }
        catch (error) {
            console.error("[ExcelConverter] Global error:", error);
            Editor.Dialog.error("[ExcelConverter] Error", error.message);
        }
    },
};
exports.methods = {
    execute: async function () {
        console.log("[ExcelConverter] Executing...");
        excelConverter.convertExcelToJson();
        return true;
    },
};
function load() { }
exports.load = load;
function unload() { }
exports.unload = unload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDYix1Q0FBeUI7QUFDekIsMkNBQTZCO0FBQzdCLDJDQUE2QjtBQVM3QixNQUFNLGNBQWMsR0FBbUI7SUFDbkMsY0FBYyxDQUFDLEdBQVcsRUFBRSxHQUFXO1FBQ25DLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztZQUFFLE9BQU87UUFFaEMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDbkIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNwQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdEMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU87Z0JBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLFFBQVEsRUFBRSxDQUFDLENBQUM7YUFDL0M7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxVQUFVLENBQUMsS0FBVSxFQUFFLElBQVk7UUFDL0IsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRTtZQUN2RCxPQUFPLElBQUksQ0FBQztTQUNmO1FBRUQscUJBQXFCO1FBQ3JCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNyQixJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVE7Z0JBQUUsT0FBTyxFQUFFLENBQUM7WUFFekMsTUFBTSxXQUFXLEdB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LENBQUM7Q0FDSixDQUFDO0FBRUYsU0FBZ0IsSUFBSSxLQUFJLENBQUM7QUFBekIsb0JBQXlCO0FBQ3pCLFNBQWdCLE1BQU0sS0FBSSxDQUFDO0FBQTNCLHdCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIjtcclxuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgKiBhcyB4bHN4IGZyb20gXCJ4bHN4XCI7XHJcblxyXG5pbnRlcmZhY2UgRXhjZWxDb252ZXJ0ZXIge1xyXG4gICAgcGFyc2VWYWx1ZSh2YWx1ZTogYW55LCB0eXBlOiBzdHJpbmcpOiBhbnk7XHJcbiAgICBjb252ZXJ0U2hlZXRUb1R5cGVkSnNvbihzaGVldDogYW55KTogYW55W107XHJcbiAgICBjb252ZXJ0RXhjZWxUb0pzb24oKTogdm9pZDtcclxuICAgIGNsZWFuRGlyZWN0b3J5KGRpcjogc3RyaW5nLCBleHQ6IHN0cmluZyk6IHZvaWQ7XHJcbn1cclxuXHJcbmNvbnN0IGV4Y2VsQ29udmVydGVyOiBFeGNlbENvbnZlcnRlciA9IHtcclxuICAgIGNsZWFuRGlyZWN0b3J5KGRpcjogc3RyaW5nLCBleHQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGlmICghZnMuZXhpc3RzU3luYyhkaXIpKSByZXR1cm47XHJcblxyXG4gICAgICAgIGNvbnN0IGZpbGVzID0gZnMucmVhZGRpclN5bmMoZGlyKTtcclxuICAgICAgICBmaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlLmVuZHNXaXRoKGV4dCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGRpciwgZmlsZSk7XHJcbiAgICAgICAgICAgICAgICBmcy51bmxpbmtTeW5jKGZpbGVQYXRoKTsgLy8g5Yig6Zmk5paH5Lu2XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW0NsZWFuXSBEZWxldGVkOiAke2ZpbGVQYXRofWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnNlVmFsdWUodmFsdWU6IGFueSwgdHlwZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEhhbmRsZSBhcnJheSB0eXBlc1xyXG4gICAgICAgIGlmICh0eXBlLmVuZHNXaXRoKFwiW11cIikpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIFtdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudFR5cGUgPSB0eXBlLnJlcGxhY2UoXCJbXVwiLCBcIlwiKTtcclxuICAgICAgICAgICAgY29uc3QgdHJpbW1lZFZhbHVlID0gdmFsdWUudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRyaW1tZWRWYWx1ZSA9PT0gXCJbXVwiIHx8IHRyaW1tZWRWYWx1ZSA9PT0gXCJcIikgcmV0dXJuIFtdO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIC8vIFRyeSB0byBwYXJzZSBhcyBKU09OIGFycmF5XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHRyaW1tZWRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJzZWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZC5tYXAoKGl0ZW0pID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VWYWx1ZShpdGVtLCBlbGVtZW50VHlwZSlcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFt0aGlzLnBhcnNlVmFsdWUocGFyc2VkLCBlbGVtZW50VHlwZSldO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBGYWxsYmFjayB0byBjb21tYS1zZXBhcmF0ZWQgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IHRyaW1tZWRWYWx1ZS5zcGxpdChcIixcIikubWFwKChzKSA9PiBzLnRyaW0oKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbXMubWFwKChpdGVtKSA9PiB0aGlzLnBhcnNlVmFsdWUoaXRlbSwgZWxlbWVudFR5cGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSGFuZGxlIGJhc2ljIHR5cGVzXHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpbnRcIjpcclxuICAgICAgICAgICAgY2FzZSBcIm51bWJlclwiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE51bWJlcih2YWx1ZSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xyXG4gICAgICAgICAgICBjYXNlIFwianNvblwiOlxyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gSlNPTi5wYXJzZSh2YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEZhaWxlZCB0byBwYXJzZSBKU09OOiAke3ZhbHVlfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29udmVydFNoZWV0VG9UeXBlZEpzb24oc2hlZXQ6IGFueSk6IGFueVtdIHtcclxuICAgICAgICBjb25zdCBleGNlbERhdGEgPSB4bHN4LnV0aWxzLnNoZWV0X3RvX2pzb24oc2hlZXQsIHsgaGVhZGVyOiAxIH0pO1xyXG5cclxuICAgICAgICBpZiAoZXhjZWxEYXRhLmxlbmd0aCA8IDMpIHJldHVybiBbXTtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZURlZnM6IGFueSA9IGV4Y2VsRGF0YVswXTsgLy8g56ys5LiA6KGM77ya5pWw5o2u57G75Z6L77yIc3RyaW5nL251bWJlci9qc29uL2pzb25bXS9udW1iZXJbXe+8iVxyXG4gICAgICAgIGNvbnN0IGZpZWxkTmFtZXM6IGFueSA9IGV4Y2VsRGF0YVsxXTsgLy8g56ys5LqM6KGM77ya5a2X5q615ZCN77yISWQvdHlwZS9qc29uQS9qc29uQXJyL251bWJlckFycu+8iVxyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgICAgICAvLyDku47nrKzkuInooYzlvIDlp4vop6PmnpDmlbDmja5cclxuICAgICAgICBmb3IgKGxldCBpID0gMjsgaSA8IGV4Y2VsRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCByb3c6IGFueSA9IGV4Y2VsRGF0YVtpXTtcclxuICAgICAgICAgICAgY29uc3Qgb2JqOiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZmllbGROYW1lcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZmllbGROYW1lID0gZmllbGROYW1lc1tqXTtcclxuICAgICAgICAgICAgICAgIGlmICghZmllbGROYW1lKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZFR5cGUgPSB0eXBlRGVmc1tqXSB8fCBcInN0cmluZ1wiO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmF3VmFsdWUgPSByb3dbal07XHJcblxyXG4gICAgICAgICAgICAgICAgb2JqW2ZpZWxkTmFtZV0gPSB0aGlzLnBhcnNlVmFsdWUocmF3VmFsdWUsIGZpZWxkVHlwZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxuXHJcbiAgICBjb252ZXJ0RXhjZWxUb0pzb24oKTogdm9pZCB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbRXhjZWxDb252ZXJ0ZXJdIFN0YXJ0aW5nIGNvbnZlcnNpb25cIik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBleGNlbERpciA9XHJcbiAgICAgICAgICAgICAgICBcIkQ6XFxcXHdvcmtBbmRTdHVkeVxcXFxDb2Nvc0NyZWF0b3JcXFxcRm9ybWFsUHJvamVjdFxcXFxyZXNcXFxcZGF0YVwiO1xyXG4gICAgICAgICAgICBjb25zdCBvdXRwdXREaXIgPSBwYXRoLmpvaW4oXHJcbiAgICAgICAgICAgICAgICBFZGl0b3IuUHJvamVjdC5wYXRoLFxyXG4gICAgICAgICAgICAgICAgXCJhc3NldHNcIixcclxuICAgICAgICAgICAgICAgIFwicmVzb3VyY2VzXCIsXHJcbiAgICAgICAgICAgICAgICBcImNvbmZpZ1wiXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWZzLmV4aXN0c1N5bmMoZXhjZWxEaXIpKSB7XHJcbiAgICAgICAgICAgICAgICBmcy5ta2RpclN5bmMoZXhjZWxEaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICAgICAgRWRpdG9yLkRpYWxvZy5pbmZvKGBDcmVhdGVkIGV4Y2VsIGRpcmVjdG9yeTogJHtleGNlbERpcn1gKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKG91dHB1dERpcikpIHtcclxuICAgICAgICAgICAgICAgIGZzLm1rZGlyU3luYyhvdXRwdXREaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsZWFuRGlyZWN0b3J5KG91dHB1dERpciwgXCIuanNvblwiKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gZnNcclxuICAgICAgICAgICAgICAgIC5yZWFkZGlyU3luYyhleGNlbERpcilcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKGZpbGUpID0+IHBhdGguZXh0bmFtZShmaWxlKS50b0xvd2VyQ2FzZSgpID09PSBcIi54bHN4XCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgRWRpdG9yLkRpYWxvZy5pbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgIFwiW0V4Y2VsQ29udmVydGVyXSBObyAueGxzeCBmaWxlcyBmb3VuZCBpbjogXCIgKyBleGNlbERpclxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHN1Y2Nlc3NDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IGZhaWxlZEZpbGVzOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4Y2VsUGF0aCA9IHBhdGguam9pbihleGNlbERpciwgZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QganNvbk5hbWUgPSBwYXRoLmJhc2VuYW1lKGZpbGUsIFwiLnhsc3hcIikgKyBcIi5qc29uXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QganNvblBhdGggPSBwYXRoLmpvaW4ob3V0cHV0RGlyLCBqc29uTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHdvcmtib29rID0geGxzeC5yZWFkRmlsZShleGNlbFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoZWV0TmFtZXMgPSB3b3JrYm9vay5TaGVldE5hbWVzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2hlZXROYW1lcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFpbGVkRmlsZXMucHVzaChgJHtmaWxlfSAobm8gd29ya3NoZWV0cylgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5jb252ZXJ0U2hlZXRUb1R5cGVkSnNvbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgd29ya2Jvb2suU2hlZXRzW3NoZWV0TmFtZXNbMF1dXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGpzb25QYXRoLCBKU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCAyKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc0NvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBgW0V4Y2VsQ29udmVydGVyXSBTdWNjZXNzOiAke2ZpbGV9IC0+ICR7anNvbk5hbWV9YFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmFpbGVkRmlsZXMucHVzaChgJHtmaWxlfSAoJHtlcnJvci5tZXNzYWdlfSlgKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbRXhjZWxDb252ZXJ0ZXJdIEZhaWxlZDogJHtmaWxlfWAsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHJlcG9ydCA9IGBbRXhjZWxDb252ZXJ0ZXJdIENvbnZlcnNpb24gY29tcGxldGUhXFxuXFxuU3VjY2VzczogJHtzdWNjZXNzQ291bnR9XFxuRmFpbGVkOiAke2ZhaWxlZEZpbGVzLmxlbmd0aH1gO1xyXG4gICAgICAgICAgICBpZiAoZmFpbGVkRmlsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcmVwb3J0ICs9IGBcXG5cXG5GYWlsZWQgZmlsZXM6XFxuJHtmYWlsZWRGaWxlcy5qb2luKFwiXFxuXCIpfWA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIEVkaXRvci5EaWFsb2cuaW5mbyhyZXBvcnQpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIltFeGNlbENvbnZlcnRlcl0gR2xvYmFsIGVycm9yOlwiLCBlcnJvcik7XHJcbiAgICAgICAgICAgIEVkaXRvci5EaWFsb2cuZXJyb3IoXCJbRXhjZWxDb252ZXJ0ZXJdIEVycm9yXCIsIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgbWV0aG9kcyA9IHtcclxuICAgIGV4ZWN1dGU6IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIltFeGNlbENvbnZlcnRlcl0gRXhlY3V0aW5nLi4uXCIpO1xyXG4gICAgICAgIGV4Y2VsQ29udmVydGVyLmNvbnZlcnRFeGNlbFRvSnNvbigpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkKCkge31cclxuZXhwb3J0IGZ1bmN0aW9uIHVubG9hZCgpIHt9XHJcbiJdfQ==