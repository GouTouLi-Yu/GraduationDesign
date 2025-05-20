import * as fs from "fs";
import * as path from "path";
import * as xlsx from "xlsx";

// 将方法提取到外部对象
const excelConverter = {
    convertExcelToJson: function () {
        try {
            console.log("开始转换");
            // 1. 修正路径转义问题
            const excelDir =
                "D:\\workAndStudy\\CocosCreator\\FormalProject\\res\\data"; // Excel文件目录
            const outputDir = path.join(
                Editor.Project.path,
                "assets",
                "resources",
                "config"
            ); // 输出目录

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
                Editor.Dialog.info(
                    "提示：" + `在目录 ${excelDir} 中未找到.xlsx文件`
                );
                return;
            }

            // 5. 批量转换
            let successCount = 0;
            const failedFiles: string[] = [];

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

                    const data = xlsx.utils.sheet_to_json(
                        workbook.Sheets[sheetNames[0]]
                    );
                    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
                    successCount++;

                    console.log(`[成功] ${file} -> ${jsonName}`);
                } catch (error: any) {
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
        } catch (error: any) {
            console.error("全局错误:", error);
            Editor.Dialog.error("转换出错", error.message);
        }
    },
};

export const methods = {
    excute: async function () {
        console.log("执行");
        // 直接调用外部对象的方法
        excelConverter.convertExcelToJson();
        console.log("导出成功");
        return true;
    },
};

// 必须导出的生命周期函数
export function load() {}
export function unload() {}
