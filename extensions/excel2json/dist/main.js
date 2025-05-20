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
// 将方法提取到外部对象
const excelConverter = {
    convertExcelToJson: function () {
        try {
            console.log("开始转换");
            // 1. 修正路径转义问题
            const excelDir = "D:\\workAndStudy\\CocosCreator\\FormalProject\\res\\data"; // Excel文件目录
            const outputDir = path.join(Editor.Project.path, "assets", "resources", "config"); // 输出目录
            // 2. 检查输入目录是否存在
            if (!fs.existsSync(excelDir)) {
                throw new Error(`Excel目录不存在: ${excelDir}`);
            }
            // 3. 确保输出目录存在
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            // 4. 获取所有Excel文件
            const files = fs
                .readdirSync(excelDir)
                .filter((file) => path.extname(file) === ".xlsx");
            if (files.length === 0) {
                Editor.Dialog.info("提示：" + `在目录 ${excelDir} 中未找到.xlsx文件`);
                return;
            }
            // 5. 批量转换
            let successCount = 0;
            const failedFiles = [];
            for (const file of files) {
                try {
                    const excelPath = path.join(excelDir, file);
                    const jsonName = path.basename(file, ".xlsx") + ".json";
                    const jsonPath = path.join(outputDir, jsonName);
                    // 6. 读取并转换Excel
                    const workbook = xlsx.readFile(excelPath);
                    const sheetNames = workbook.SheetNames;
                    if (sheetNames.length === 0) {
                        failedFiles.push(`${file} (无工作表)`);
                        continue;
                    }
                    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
                    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
                    successCount++;
                    console.log(`[成功] ${file} -> ${jsonName}`);
                }
                catch (error) {
                    failedFiles.push(`${file} (${error.message})`);
                    console.error(`[失败] ${file}:`, error);
                }
            }
            // 7. 生成结果报告
            let report = `转换完成！\n\n成功: ${successCount}个\n失败: ${failedFiles.length}个`;
            if (failedFiles.length > 0) {
                report += `\n\n失败文件列表:\n${failedFiles.join("\n")}`;
            }
            // 8. 显示结果
            Editor.Dialog.info("转换结果" + report);
        }
        catch (error) {
            console.error("全局错误:", error);
            Editor.Dialog.error("转换出错", error.message);
        }
    },
};
exports.methods = {
    excute: async function () {
        console.log("执行");
        // 直接调用外部对象的方法
        excelConverter.convertExcelToJson();
        console.log("导出成功");
        return true;
    },
};
// 必须导出的生命周期函数
function load() { }
exports.load = load;
function unload() { }
exports.unload = unload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQXlCO0FBQ3pCLDJDQUE2QjtBQUM3QiwyQ0FBNkI7QUFFN0IsYUFBYTtBQUNiLE1BQU0sY0FBYyxHQUFHO0lBQ25CLGtCQUFrQixFQUFFO1FBQ2hCLElBQUk7WUFDQSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BCLGNBQWM7WUFDZCxNQUFNLFFBQVEsR0FDViwwREFBMEQsQ0FBQyxDQUFDLFlBQVk7WUFDNUUsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FDdkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQ25CLFFBQVEsRUFDUixXQUFXLEVBQ1gsUUFBUSxDQUNYLENBQUMsQ0FBQyxPQUFPO1lBRVYsZ0JBQWdCO1lBQ2hCLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsUUFBUSxFQUFFLENBQUMsQ0FBQzthQUM5QztZQUVELGNBQWM7WUFDZCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDM0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQzthQUNoRDtZQUVELGlCQUFpQjtZQUNqQixNQUFNLEtBQUssR0FBRyxFQUFFO2lCQUNYLFdBQVcsQ0FBQyxRQUFRLENBQUM7aUJBQ3JCLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUV0RCxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNwQixN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LENBQUM7QUFBM0Isd0JBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0ICogYXMgeGxzeCBmcm9tIFwieGxzeFwiO1xyXG5cclxuLy8g5bCG5pa55rOV5o+Q5Y+W5Yiw5aSW6YOo5a+56LGhXHJcbmNvbnN0IGV4Y2VsQ29udmVydGVyID0ge1xyXG4gICAgY29udmVydEV4Y2VsVG9Kc29uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCLlvIDlp4vovazmjaJcIik7XHJcbiAgICAgICAgICAgIC8vIDEuIOS/ruato+i3r+W+hOi9rOS5iemXrumimFxyXG4gICAgICAgICAgICBjb25zdCBleGNlbERpciA9XHJcbiAgICAgICAgICAgICAgICBcIkQ6XFxcXHdvcmtBbmRTdHVkeVxcXFxDb2Nvc0NyZWF0b3JcXFxcRm9ybWFsUHJvamVjdFxcXFxyZXNcXFxcZGF0YVwiOyAvLyBFeGNlbOaWh+S7tuebruW9lVxyXG4gICAgICAgICAgICBjb25zdCBvdXRwdXREaXIgPSBwYXRoLmpvaW4oXHJcbiAgICAgICAgICAgICAgICBFZGl0b3IuUHJvamVjdC5wYXRoLFxyXG4gICAgICAgICAgICAgICAgXCJhc3NldHNcIixcclxuICAgICAgICAgICAgICAgIFwicmVzb3VyY2VzXCIsXHJcbiAgICAgICAgICAgICAgICBcImNvbmZpZ1wiXHJcbiAgICAgICAgICAgICk7IC8vIOi+k+WHuuebruW9lVxyXG5cclxuICAgICAgICAgICAgLy8gMi4g5qOA5p+l6L6T5YWl55uu5b2V5piv5ZCm5a2Y5ZyoXHJcbiAgICAgICAgICAgIGlmICghZnMuZXhpc3RzU3luYyhleGNlbERpcikpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhjZWznm67lvZXkuI3lrZjlnKg6ICR7ZXhjZWxEaXJ9YCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIDMuIOehruS/nei+k+WHuuebruW9leWtmOWcqFxyXG4gICAgICAgICAgICBpZiAoIWZzLmV4aXN0c1N5bmMob3V0cHV0RGlyKSkge1xyXG4gICAgICAgICAgICAgICAgZnMubWtkaXJTeW5jKG91dHB1dERpciwgeyByZWN1cnNpdmU6IHRydWUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIDQuIOiOt+WPluaJgOaciUV4Y2Vs5paH5Lu2XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gZnNcclxuICAgICAgICAgICAgICAgIC5yZWFkZGlyU3luYyhleGNlbERpcilcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKGZpbGUpID0+IHBhdGguZXh0bmFtZShmaWxlKSA9PT0gXCIueGxzeFwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmaWxlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIEVkaXRvci5EaWFsb2cuaW5mbyhcclxuICAgICAgICAgICAgICAgICAgICBcIuaPkOekuu+8mlwiICsgYOWcqOebruW9lSAke2V4Y2VsRGlyfSDkuK3mnKrmib7liLAueGxzeOaWh+S7tmBcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIDUuIOaJuemHj+i9rOaNolxyXG4gICAgICAgICAgICBsZXQgc3VjY2Vzc0NvdW50ID0gMDtcclxuICAgICAgICAgICAgY29uc3QgZmFpbGVkRmlsZXM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhjZWxQYXRoID0gcGF0aC5qb2luKGV4Y2VsRGlyLCBmaWxlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBqc29uTmFtZSA9IHBhdGguYmFzZW5hbWUoZmlsZSwgXCIueGxzeFwiKSArIFwiLmpzb25cIjtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBqc29uUGF0aCA9IHBhdGguam9pbihvdXRwdXREaXIsIGpzb25OYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gNi4g6K+75Y+W5bm26L2s5o2iRXhjZWxcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB3b3JrYm9vayA9IHhsc3gucmVhZEZpbGUoZXhjZWxQYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaGVldE5hbWVzID0gd29ya2Jvb2suU2hlZXROYW1lcztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNoZWV0TmFtZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhaWxlZEZpbGVzLnB1c2goYCR7ZmlsZX0gKOaXoOW3peS9nOihqClgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0geGxzeC51dGlscy5zaGVldF90b19qc29uKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JrYm9vay5TaGVldHNbc2hlZXROYW1lc1swXV1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoanNvblBhdGgsIEpTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIDIpKTtcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFvmiJDlip9dICR7ZmlsZX0gLT4gJHtqc29uTmFtZX1gKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmYWlsZWRGaWxlcy5wdXNoKGAke2ZpbGV9ICgke2Vycm9yLm1lc3NhZ2V9KWApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFvlpLHotKVdICR7ZmlsZX06YCwgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyA3LiDnlJ/miJDnu5PmnpzmiqXlkYpcclxuICAgICAgICAgICAgbGV0IHJlcG9ydCA9IGDovazmjaLlrozmiJDvvIFcXG5cXG7miJDlip86ICR7c3VjY2Vzc0NvdW50feS4qlxcbuWksei0pTogJHtmYWlsZWRGaWxlcy5sZW5ndGh95LiqYDtcclxuXHJcbiAgICAgICAgICAgIGlmIChmYWlsZWRGaWxlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXBvcnQgKz0gYFxcblxcbuWksei0peaWh+S7tuWIl+ihqDpcXG4ke2ZhaWxlZEZpbGVzLmpvaW4oXCJcXG5cIil9YDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gOC4g5pi+56S657uT5p6cXHJcbiAgICAgICAgICAgIEVkaXRvci5EaWFsb2cuaW5mbyhcIui9rOaNoue7k+aenFwiICsgcmVwb3J0KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCLlhajlsYDplJnor686XCIsIGVycm9yKTtcclxuICAgICAgICAgICAgRWRpdG9yLkRpYWxvZy5lcnJvcihcIui9rOaNouWHuumUmVwiLCBlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IG1ldGhvZHMgPSB7XHJcbiAgICBleGN1dGU6IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIuaJp+ihjFwiKTtcclxuICAgICAgICAvLyDnm7TmjqXosIPnlKjlpJbpg6jlr7nosaHnmoTmlrnms5VcclxuICAgICAgICBleGNlbENvbnZlcnRlci5jb252ZXJ0RXhjZWxUb0pzb24oKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIuWvvOWHuuaIkOWKn1wiKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcbn07XHJcblxyXG4vLyDlv4Xpobvlr7zlh7rnmoTnlJ/lkb3lkajmnJ/lh73mlbBcclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWQoKSB7fVxyXG5leHBvcnQgZnVuY3Rpb24gdW5sb2FkKCkge31cclxuIl19