import { instantiate, Node, Prefab, resources, SpriteFrame } from "cc";

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
    static loadTexture(path: string): Promise<SpriteFrame> {
        return new Promise((reslove, reject) => {
            resources.load(path, SpriteFrame, (err: Error, sf: SpriteFrame) => {
                if (err) {
                    reject(err);
                }
                else {
                    reslove(sf);
                }

            })
        })
    }
}

