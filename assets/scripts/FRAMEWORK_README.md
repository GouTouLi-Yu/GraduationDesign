# 框架代码说明

本项目已清理完成，只保留了框架代码，所有具体的游戏玩法代码已删除。

## 保留的框架代码

### 核心框架 (core/)

#### View层
- `core/view/Mediator.ts` - Mediator基类
- `core/view/UIBasePanel.ts` - UI面板基类
- `core/view/PopupMediator.ts` - 弹窗Mediator基类
- `core/view/AreaMediator.ts` - 区域Mediator基类

#### Controller层
- `core/controller/Facade.ts` - Facade基类

#### Model层
- `core/model/Model.ts` - Model基类

#### Helper工具
- `core/helper/MathHelper.ts` - 数学工具类
- `core/helper/TimeHelper.ts` - 时间工具类

### 项目框架 (project/)

#### 管理器 (manager/)
- `EventManager.ts` - 事件管理器
- `GameManager.ts` - 游戏管理器（已清理具体引用）
- `PlayerDataManager.ts` - 玩家数据管理器（已清理具体引用）
- `ResManager.ts` - 资源管理器
- `SceneManager.ts` - 场景管理器
- `UIManager.ts` - UI管理器

#### 配置 (config/)
- `ClassConfig.ts` - 类配置管理器
- `GameConfig.ts` - 游戏配置（已清理具体内容）
- `ViewConfig.ts` - 视图配置

#### 其他
- `ConfigReader/ConfigReader.ts` - 配置读取器
- `Injector/Injector.ts` - 依赖注入器
- `event/EventObject.ts` - 事件对象基类
- `event/EventType.ts` - 事件类型管理器
- `dataStore/DataStore.ts` - 数据存储
- `debug/Debug.ts` - 调试工具
- `disposableObject/DisposableObject.ts` - 可释放对象基类
- `SingleTon.ts` - 单例基类
- `strings/Strings.ts` - 字符串管理器
- `strings/StringConstants.ts` - 字符串常量（已清空）

### 引擎扩展 (engine/)
- `NodeExt.ts` - Node扩展方法

### 主入口
- `Main.ts` - 游戏主入口（已清理具体初始化）

## 已删除的具体实现

### 已删除的Mediator
- BattleMediator
- MainMenuMediator
- ShopMediator
- TransmitMediator
- TestMediator
- CharacterPanel

### 已删除的Facade
- BattleFacade
- MainMenuFacade
- TransmitFacade

### 已删除的Model
- BattleModel, BattleCharacter, BattlePlayerCharacter, BattleMonsterCharacter
- MainMenuModel
- Player
- Card, CardModel
- Buff
- Action
- Portal
- QuestModel
- Skill
- Strategy系列（AttackStrategy, RecoverStrategy等）
- Treasure

### 已删除的事件
- CharacterEvent
- MainMenuEvent
- TypeWriterEvent

### 已删除的Helper
- AttributeHelper
- BattleHelper
- BuffHelper
- QuestHelper

### 已删除的UI组件
- TypeWriter

## 如何使用框架

### 1. 创建新的Mediator

```typescript
import { UIBasePanel } from "../core/view/UIBasePanel";

export class YourMediator extends UIBasePanel {
    initialize() {
        // 初始化逻辑
    }

    onRegister() {
        // 注册逻辑
    }

    enterWithData(data?: any) {
        // 进入时逻辑
    }

    mapEventListeners() {
        // 映射事件监听
    }

    resumeWithData(data?: any) {
        // 恢复时逻辑
    }
}
```

### 2. 创建新的Model

```typescript
import { Model } from "../core/model/Model";

export class YourModel extends Model {
    initialize() {
        // 初始化逻辑
    }

    syncData(data: any) {
        // 同步数据逻辑
    }

    syncDelData(data: any) {
        // 删除数据逻辑
    }
}
```

### 3. 注册到ClassConfig

```typescript
import { ClassConfig } from "./project/config/ClassConfig";
import { YourMediator } from "./core/view/YourMediator";

ClassConfig.addClass("YourMediator", YourMediator);
```

### 4. 使用UIManager跳转

```typescript
import { UIManager } from "./project/manager/UIManager";

UIManager.gotoView("YourView");
```

### 5. 使用事件系统

```typescript
import { EventManager } from "./project/manager/EventManager";
import { PCEventType } from "./project/event/EventType";

// 定义事件类型
const YOUR_EVENT = PCEventType.eventTypeFromString("YourEvent");

// 派发事件
EventManager.dispatchEvent(YOUR_EVENT, data);

// 监听事件
EventManager.addEventListener(YOUR_EVENT, (data) => {
    // 处理事件
});
```

## 注意事项

1. 所有具体的游戏逻辑代码已删除，需要根据新游戏类型重新实现
2. 配置文件中的具体内容已清空，需要重新配置
3. GameManager.startGame() 中的具体跳转已删除，需要根据新游戏实现
4. 字符串常量已清空，需要重新添加
5. 保留的Helper（MathHelper, TimeHelper）是通用工具，可以继续使用

## 下一步

1. 根据新游戏类型创建对应的Mediator、Model、Facade
2. 在ClassConfig中注册新的类
3. 配置ViewConfig和GameConfig
4. 实现GameManager.startGame()的具体逻辑
5. 添加新游戏需要的字符串常量

