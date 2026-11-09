# 弦迹 · 自学吉他

一间随身的吉他练习室。从六根空弦起步，经过开放和弦、节奏与指弹，走到乐理、蓝调和即兴。

| 模块 | 当前内容 |
| --- | --- |
| 学习路径 | 四个阶段、16 节课。每节都有练法、听辨提示和验收目标 |
| 曲谱 | 五首六线谱。支持速度调整、小节区间与循环试听 |
| 练习室 | 35–240 BPM 节拍器、点按定速、练习与休息轮次、标准调弦参考音、11 张可试听的和弦图 |
| 主题 | 蕨影、月汐、暮弦三套配色，各有浅色、深色和跟随系统 |
| 记录 | 离线保存课程进度和练习时长。可手动同步到自建 Go 服务 |

## 运行客户端

需要 Node.js 22.12+。核心学习和练习功能可离线使用。

```sh
npm ci
npm run dev
npm run desktop
```

打开 <http://127.0.0.1:5173> 访问开发版。Electron、Android 和 iOS 都使用同一份 React + TypeScript 界面。平台安装文件见 [GitHub Releases](https://github.com/xiaoqianling/xianji/releases)。

## 跨设备同步

在「设置 → 跨设备同步」填写自建服务的 HTTPS 地址。第一次同步可创建档案。其他设备填入同一地址和令牌即可合并记录。

## 仓库结构

```text
src/
  features/         首页、课程、曲谱、练习、设置
  components/       可试听的和弦图等跨模块组件
  audio/            音频时钟、播放调度、标准弦音
  journal/          本地保存、记录合并、同步请求
  styles/           主题 token、基础、布局及响应式规则
content/            前后端共用的课程、和弦、六线谱
desktop/            Electron 主进程和本地协议
android/ ios/       Capacitor 原生工程
tests/              曲谱数据校验、Playwright 浏览器用例
```

- [AGENTS.md](AGENTS.md) 维护约定和验证入口
- [跨端构建和发布](docs/build.md)
- [课程设计和曲谱来源](docs/content.md)
