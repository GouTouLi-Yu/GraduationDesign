import {
    instantiate,
    JsonAsset,
    Node,
    Prefab,
    resources,
    Sprite,
    SpriteFrame,
} from "cc";

export class ResManager {
    static loadPrefab(path: string): Promise<Node> {
        return new Promise<Node>((resolve, reject) => {
            resources.load(path, Prefab, (err: Error, prefab: Prefab) => {
                if (err) {
                    reject(err);
                    return;
                }
                let node = instantiate(prefab);
                resolve(node);
            });
        }).catch((err) => {
            console.error(`Failed to load prefab at ${path}:`, err);
            return null;
        });
    }

    /** 动态加载图片 */
    static loadTexture(node: Node, path: string) {
        if (!node) {
            console.error(`${node.name} is null or undefined`);
            return;
        }
        let sprite = node.getComponent(Sprite);
        if (!sprite) {
            console.error(`${node.name} is not a SpriteFrame`);
            return;
        }
        path = path + "/SpriteFrame";
        resources.load(path, SpriteFrame, (err: Error, sf: SpriteFrame) => {
            if (err) {
                console.error(`Failed to load texture at ${path}:`, err);
                return;
            }
            sprite.spriteFrame = sf;
        });
    }

    static loadConfig(path: string): Promise<Array<JsonAsset>> {
        if (!path) {
            console.error("path is null or undefined");
            return Promise.reject("path is null or undefined");
        }
        return new Promise<Array<JsonAsset>>((resolve, reject) => {
            resources.loadDir(
                path,
                Array<JsonAsset>,
                (err: Error, jsonArr: Array<JsonAsset>) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(jsonArr);
                }
            );
        });
    }
}
