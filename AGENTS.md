# 弦迹客户端维护约定

- 先读 README 和对应的 docs。按功能目录修改客户端。跨功能组件放在 src/components，音频和同步逻辑留在独立模块。
- UI 使用 src/styles/tokens.css 的主题变量。变更组件后检查手机宽度、键盘焦点和深色模式。曲谱和节拍共用 src/audio/music.ts 的音频时钟。
- 课程、和弦和谱面在 content/catalog.json 维护。已有课程 ID 和练习 UUID 是同步键。新增课程时同步更新服务端的目录快照。
- 原生工程可提交，Capacitor 复制的 Web 资源由构建生成。密钥与令牌存于工作区外或 Actions Secrets。
- 交付前运行 npm test、npm run build 和 npm run test:e2e。
