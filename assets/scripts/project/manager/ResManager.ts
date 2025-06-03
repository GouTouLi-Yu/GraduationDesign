import {
    Asset,
    AssetManager,
    error,
    instantiate,
    isValid,
    JsonAsset,
    Node,
    Prefab,
    resources,
    Sprite,
    SpriteFrame,
} from "cc";
import { Debug } from "../debug/Debug";

export class MyResManager {
    private static _manualAssetMap: Map<string, Asset> = new Map<
        string,
        Asset
    >();

    /**
     * 初始化资源管理器
     */
    static init() {
        this._manualAssetMap = new Map<string, Asset>();
    }

    /**
     * 清除所有管理的资源（不包含持久化资源）
     */
    static clearAllAssets() {
        Debug.printMemoryUsage(
            "资源清理前，内存占用情况 -------------------------------------------------------------"
        );

        setTimeout(() => {
            // this._clearAllAssets();
            Debug.printMemoryUsage(
                "资源清理后，内存占用情况 -------------------------------------------------------------"
            );
        }, 100);
    }

    private static _clearAllAssets() {
        const assetCount = this._manualAssetMap.size;
        if (assetCount > 0) {
            // 创建副本避免迭代时修改集合的问题
            const manualAssets = new Map(this._manualAssetMap);
            manualAssets.forEach((asset, key) => {
                try {
                    this.releaseManualAsset(key, asset);
                } catch (e) {
                    console.error(`Error releasing manual asset ${key}:`, e);
                }
            });

            this._manualAssetMap.clear();
        }
        // 释放无引用的资源
        const assets = AssetManager.instance.assets;
        const toDestroy = [];
        // 先收集需要销毁的资源
        assets.forEach((asset, key) => {
            if (asset.refCount <= 0) {
                toDestroy.push({ key, asset });
            }
        });
        // 然后统一销毁
        toDestroy.forEach(({ key, asset }) => {
            try {
                asset.destroy();
                // 如果destroy后需要从assets中移除
                assets.remove(key);
            } catch (e) {
                console.error(`Error destroying asset ${key}:`, e);
            }
        });
    }

    static printAssetInfo() {
        let assets = AssetManager.instance.assets;
        assets.forEach((asset, key) => {
            console.log("资源名 = ", asset.name);
            console.log(asset.refCount);
            console.log("------------------------------------");
        });
        console.log("assets", assets);
    }

    /**
     * 加载预制体
     * @param path 资源路径
     * @returns 实例化后的节点
     */
    static async loadPrefab(path: string): Promise<Node | null> {
        if (!path) {
            error("[ResManager] Prefab path is empty");
            return null;
        }

        try {
            const prefab = await this.loadAsset<Prefab>(path, Prefab);
            if (!prefab) {
                error(`[ResManager] Prefab at ${path} is null`);
                return null;
            }

            const node = instantiate(prefab);
            if (!node) {
                this.releaseManualAsset(path, prefab);
                error(`[ResManager] Failed to instantiate prefab at ${path}`);
                return null;
            }

            return node;
        } catch (err) {
            error(`[ResManager] Failed to load prefab at ${path}:`, err);
            return null;
        }
    }

    /**
     * 加载纹理并设置到Sprite组件
     * @param node 目标节点
     * @param path 资源路径
     */
    static async loadTexture(node: Node, path: string): Promise<void> {
        if (!node || !isValid(node)) {
            throw new Error("[ResManager] Invalid node");
        }

        const sprite = node.getComponent(Sprite);
        if (!sprite) {
            throw new Error(
                `[ResManager] Node "${node.name}" has no Sprite component`
            );
        }

        if (!path) {
            throw new Error("[ResManager] Texture path is empty");
        }

        try {
            const newSpriteFrame = await this.loadAsset<SpriteFrame>(
                path,
                SpriteFrame
            );
            if (!newSpriteFrame) {
                throw new Error("[ResManager] Loaded SpriteFrame is null");
            }

            const oldSpriteFrame = sprite.spriteFrame;
            sprite.spriteFrame = newSpriteFrame;

            // 管理新资源
            const newKey = `${path}_${node.uuid}`;
            this._manualAssetMap.set(newKey, newSpriteFrame);

            // 释放旧资源
            if (oldSpriteFrame) {
                const oldKey = this.findAssetKeyByValue(oldSpriteFrame);
                if (oldKey) {
                    this.releaseManualAsset(oldKey, oldSpriteFrame);
                }
            }
        } catch (err) {
            error(`[ResManager] Failed to load texture at ${path}:`, err);
            throw err;
        }
    }

    // 新增辅助方法
    private static releaseManualAsset(key: string, asset: Asset) {
        asset.decRef();
        if (asset.refCount <= 0) {
            asset.destroy();
        }
        this._manualAssetMap.delete(key);
    }

    /**
     * 加载配置文件（不会被自动释放）
     * @param path 资源路径
     * @returns JsonAsset数组
     */
    static async loadConfig(path: string): Promise<JsonAsset[]> {
        if (!path) {
            throw new Error("[ResManager] Config path is empty");
        }

        try {
            const jsonAssets = await this.loadDir<JsonAsset>(path, JsonAsset);
            return jsonAssets;
        } catch (err) {
            error(`[ResManager] Failed to load config at ${path}:`, err);
            throw err;
        }
    }

    /**
     * 通用资源加载方法
     */
    private static loadAsset<T extends Asset>(
        path: string,
        type: new () => T
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            resources.load(path, type, (err: Error | null, asset: T) => {
                if (err || !asset) {
                    reject(err || new Error(`Asset at ${path} is null`));
                    return;
                }
                asset.addRef();
                resolve(asset);
            });
        });
    }

    /**
     * 通用目录资源加载方法
     */
    private static loadDir<T extends Asset>(
        path: string,
        type: new () => T
    ): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            resources.loadDir(path, type, (err: Error | null, assets: T[]) => {
                if (err || !assets) {
                    reject(err || new Error(`Assets at ${path} are null`));
                    return;
                }
                assets.forEach((asset) => asset.addRef());
                resolve(assets);
            });
        });
    }

    /**
     * 通过资源实例查找键名
     */
    private static findAssetKeyByValue(
        asset: Asset | null
    ): string | undefined {
        if (!asset || !isValid(asset)) return undefined;

        for (const [key, val] of this._manualAssetMap.entries()) {
            if (val === asset) return key;
        }
        return undefined;
    }
}
