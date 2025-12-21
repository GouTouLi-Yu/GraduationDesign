export class NetworkManager {
    private static _instance: NetworkManager;
    private _ws: WebSocket | null = null;
    private _listeners: Map<string, Function[]> = new Map();
    private _reconnectAttempts: number = 0;
    private readonly MAX_RECONNECT = 5;
    private _heartbeatInterval: number = 0;

    // 单例模式，便于全局访问
    public static getInstance(): NetworkManager {
        if (!this._instance) {
            this._instance = new NetworkManager();
        }
        return this._instance;
    }

    private constructor() {
        // 私有构造函数，确保单例
    }

    // --- HTTP 短连接方法 ---
    public async httpRequest<T>(
        url: string,
        options?: {
            method?: string;
            data?: any;
            headers?: Record<string, string>;
        }
    ): Promise<T> {
        const method = options?.method || "GET";
        const headers = options?.headers || {
            "Content-Type": "application/json",
        };

        const config: RequestInit = {
            method,
            headers,
        };

        if (options?.data) {
            config.body =
                method === "GET" ? null : JSON.stringify(options.data);
        }

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}: ${response.statusText}`
                );
            }

            const data: T = await response.json();
            this.emit("http-success", { url, data });
            return data;
        } catch (error) {
            this.emit("http-error", { url, error });
            throw error;
        }
    }

    // --- WebSocket 长连接方法 ---
    public connectWebSocket(url: string): void {
        if (this._ws?.readyState === WebSocket.OPEN) {
            console.warn("WebSocket 已经连接");
            return;
        }

        this._ws = new WebSocket(url);
        this._setupWebSocketEvents();
    }

    private _setupWebSocketEvents(): void {
        if (!this._ws) return;

        this._ws.onopen = () => {
            console.log("✅ WebSocket 连接成功");
            this._reconnectAttempts = 0;
            this.emit("ws-open", null);
            this._startHeartbeat();
        };

        this._ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.emit("ws-message", data);
                // 根据协议号分发消息（假设协议格式为 { cmd: 'xxx', data: ... }）
                if (data.cmd) {
                    this.emit(`cmd-${data.cmd}`, data);
                }
            } catch (e) {
                console.warn("收到非JSON消息:", event.data);
            }
        };

        this._ws.onerror = (error) => {
            console.error("WebSocket 错误:", error);
            this.emit("ws-error", error);
        };

        this._ws.onclose = () => {
            console.log("WebSocket 连接关闭");
            this._stopHeartbeat();
            this.emit("ws-close", null);
            this._tryReconnect();
        };
    }

    // 发送 WebSocket 消息
    public sendWebSocketMessage(data: any): void {
        if (this._ws?.readyState !== WebSocket.OPEN) {
            console.error("WebSocket 未连接");
            this.emit("ws-error", "连接未就绪");
            return;
        }

        const payload = typeof data === "string" ? data : JSON.stringify(data);
        this._ws.send(payload);
    }

    // --- 心跳机制 ---
    private _startHeartbeat(): void {
        this._stopHeartbeat(); // 清理旧的心跳
        this._heartbeatInterval = window.setInterval(() => {
            this.sendWebSocketMessage({ cmd: "heartbeat", time: Date.now() });
        }, 30000); // 30秒一次心跳
    }

    private _stopHeartbeat(): void {
        if (this._heartbeatInterval) {
            clearInterval(this._heartbeatInterval);
            this._heartbeatInterval = 0;
        }
    }

    // --- 断线重连 ---
    private _tryReconnect(): void {
        if (this._reconnectAttempts >= this.MAX_RECONNECT) {
            console.error("达到最大重连次数");
            this.emit("ws-reconnect-failed", null);
            return;
        }

        this._reconnectAttempts++;
        const delay = Math.min(
            1000 * Math.pow(2, this._reconnectAttempts),
            30000
        );

        console.log(`♻️ ${this._reconnectAttempts}秒后尝试重连...`);

        setTimeout(() => {
            if (this._ws?.readyState === WebSocket.CLOSED) {
                this.connectWebSocket(this._ws.url);
            }
        }, delay);
    }

    // --- 事件系统（用于与UI解耦）---
    public on(event: string, callback: Function): void {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, []);
        }
        this._listeners.get(event)!.push(callback);
    }

    public off(event: string, callback: Function): void {
        const listeners = this._listeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index > -1) listeners.splice(index, 1);
        }
    }

    private emit(event: string, data?: any): void {
        const listeners = this._listeners.get(event);
        if (listeners) {
            listeners.forEach((callback) => {
                try {
                    callback(data);
                } catch (e) {
                    console.error(`事件 ${event} 回调执行失败:`, e);
                }
            });
        }
    }

    // --- 清理资源 ---
    public disconnect(): void {
        this._stopHeartbeat();
        if (this._ws) {
            this._ws.close();
            this._ws = null;
        }
        this._listeners.clear();
    }

    public getWebSocketState(): string {
        if (!this._ws) return "CLOSED";
        const states = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
        return states[this._ws.readyState] || "UNKNOWN";
    }
}
