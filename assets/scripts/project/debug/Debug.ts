export class Debug {
    // 添加内存使用情况打印方法
    static printMemoryUsage(label = "Memory usage") {
        try {
            // Node.js 环境
            if (typeof process !== "undefined" && process.versions?.node) {
                const mem = process.memoryUsage();
                console.log(`[${label}] Node.js Memory:
  RSS: ${this.formatBytes(mem.rss)}
  HeapTotal: ${this.formatBytes(mem.heapTotal)}
  HeapUsed: ${this.formatBytes(mem.heapUsed)}`);
                return;
            }

            // 浏览器环境（Chrome）
            const perf = window.performance as Performance & {
                memory?: {
                    usedJSHeapSize: number;
                    totalJSHeapSize: number;
                    jsHeapSizeLimit: number;
                };
            };
            if (perf.memory) {
                console.log(`[${label}] Browser Memory:
  Used: ${this.formatBytes(perf.memory.usedJSHeapSize)}
  Total: ${this.formatBytes(perf.memory.totalJSHeapSize)}
  Limit: ${this.formatBytes(perf.memory.jsHeapSizeLimit)}`);
                return;
            }

            console.warn(`[${label}] Memory API not available`);
        } catch (e) {
            console.error(`Memory check failed:`, e);
        }
    }

    // 辅助方法：格式化字节显示
    static formatBytes(bytes) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }
}
