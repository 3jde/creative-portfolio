# ONE ZEN 作品目录维护说明

这个站点现在由 `assets/work-catalog.js` 统一管理作品。首页、生成艺术页、交互影像页、游戏页都会读取这份目录。

## 删除或临时隐藏作品

不建议直接删除旧作品文件。先在 `assets/work-catalog.js` 对应条目里加入：

```js
published: false,
```

这样作品不会出现在新网站目录里，但原始文件仍保留，后面可以恢复。

## 新增作品或游戏

把作品文件放进合适目录，例如：

```text
interactive_arts/2026-06-18-new-game/index.html
```

然后在 `assets/work-catalog.js` 里复制一个条目，修改这些字段：

```js
{
  id: "new-game",
  title: "New Game",
  date: "2026-06-18",
  section: "game",
  format: "Touch-first arcade",
  url: "interactive_arts/2026-06-18-new-game/index.html",
  status: "New",
  featured: true,
  palette: "cyan",
  description: "一句清楚说明这个作品的体验、规则或概念。",
  tags: ["Game", "Touch", "Arcade"]
}
```

`section` 目前支持：

- `generative`：生成艺术、每日实验、算法作品
- `game`：游戏和可玩项目
- `camera`：摄像头、视觉识别、实时影像互动

`featured: true` 会让作品进入首页精选区；普通归档作品设为 `false`。

## 推荐整理规则

- 精选作品保持在 6 到 9 个以内。
- 每个作品都写清楚 `format`、`description` 和 3 到 5 个 `tags`。
- 不成熟作品先保留文件，但设为 `published: false`。
- 旧的 `daily_arts`、`public/interactive_arts`、`sketches` 可以暂时保留，等确认没有引用后再统一迁移。
