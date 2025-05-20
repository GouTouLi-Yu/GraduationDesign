// 必须使用这种导出结构

export const methods = {
    excute: async function () {
        console.log("执行");
        return true;
    },

    // async convertExcelToJson() {
    //     try {
    //         // 1. 使用 Cocos Creator 的对话框选择目录
    //         const result = await Editor.Dialog.select({
    //             title: "选择Excel目录",
    //             defaultPath: "D:\\config",
    //             properties: ["openDirectory"],
    //         });

    //         if (result.canceled || !result.filePaths[0]) {
    //             console.log("用户取消选择");
    //             return;
    //         }

    //         const excelDir = result.filePaths[0];
    //         const outputDir = path.join(
    //             Editor.Project.path,
    //             "assets",
    //             "resources",
    //             "config"
    //         );

    //         // 2. 确保输出目录存在
    //         if (!fs.existsSync(outputDir)) {
    //             fs.mkdirSync(outputDir, { recursive: true });
    //         }

    //         // 3. 处理所有Excel文件
    //         const files = fs.readdirSync(excelDir);
    //         let count = 0;

    //         for (const file of files) {
    //             if (path.extname(file) === ".xlsx") {
    //                 const excelPath = path.join(excelDir, file);
    //                 const jsonName = path.basename(file, ".xlsx") + ".json";
    //                 const jsonPath = path.join(outputDir, jsonName);

    //                 // 4. 读取Excel并转换为JSON
    //                 const workbook = xlsx.readFile(excelPath);
    //                 const sheetNames = workbook.SheetNames;
    //                 const data = xlsx.utils.sheet_to_json(
    //                     workbook.Sheets[sheetNames[0]]
    //                 );

    //                 // 5. 保存JSON文件
    //                 fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    //                 count++;
    //                 console.log(`已转换: ${file} -> ${jsonName}`);

    //                 // 更新进度
    //                 await Editor.Message.request(
    //                     "excel2json",
    //                     "update-progress",
    //                     {
    //                         current: count,
    //                         total: files.length,
    //                         filename: file,
    //                     }
    //                 );
    //             }
    //         }

    //         // 6. 显示完成提示
    //         Editor.Dialog.info("转换完成", `成功转换 ${count} 个Excel文件`);
    //     } catch (error) {
    //         console.error("转换出错:", error);
    //         Editor.Dialog.error("转换出错", error.message);
    //     }
    // },
};

// 必须导出的生命周期函数
export function load() {}
export function unload() {}
