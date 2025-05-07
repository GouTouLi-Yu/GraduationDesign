import { instantiate, Node, Prefab, resources } from "cc";

export class ResManager {
    static loadPrefab(path: string): Promise<Node> {
        return new Promise<Node>((resolve, reject) => {
            resources.load(path, Prefab, (err: Error, prefab: Prefab) => {
                if (err) {
                    reject(err);
                } else {
                    let node = instantiate(prefab);
                    if (node) {
                        resolve(node);
                    }
                }
            });
        });
    }
}
