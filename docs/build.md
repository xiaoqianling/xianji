# 跨端构建与发布

React 与 Vite 输出 `dist/`。Electron 通过受限本地协议加载该目录，Capacitor 同步同样的静态资源到原生工程。

## Windows

```powershell
npm ci
npm run package:win
```

安装包位于 `release/`。现有构建使用 NSIS，目标为 Windows x64。带 Authenticode 签名的发行版可给 electron-builder 配置自己的代码签名证书。

## Android

准备 JDK 21、Android SDK 36、Build Tools 36.0.0 和 Android 平台工具。以下为 PowerShell 命令。

```powershell
npm ci
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
.\gradlew.bat assembleRelease
```

Debug APK 可本地调试。Release APK 位于 `android/app/build/outputs/apk/release/`，经 `zipalign` 后用 `apksigner` 签名和验证。版本号在 `android/app/build.gradle`。更新已安装的 APK 时沿用同一应用 ID 和签名密钥，并提高 versionCode。

## iOS

在 macOS 安装 Xcode 26+，选定 Command Line Tools 后运行：

```sh
npm ci
npm run build
npx cap sync ios
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release \
  -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath ./tmp/ios CODE_SIGNING_ALLOWED=NO build
xcrun simctl install booted tmp/ios/Build/Products/Release-iphonesimulator/App.app
```

原生工程采用 Swift Package Manager。模拟器包可在 macOS 的 iOS Simulator 安装。真机分发时在 Xcode 配置团队及证书，生成归档并按所选渠道导出。版本号为 Xcode 工程的 MARKETING_VERSION 和 CURRENT_PROJECT_VERSION。

## GitHub Actions

- `CI` 校验目录数据、构建前端、运行 Playwright。
- `Release` 生成 Windows EXE、签名 Android APK、iOS 模拟器 ZIP 以及 SHA-256 清单。版本标签如 `v0.1.0` 必须匹配 package.json，三端原生版本在打标签前一起更新。
- Android 发布使用 `ANDROID_KEYSTORE_BASE64` 和 `ANDROID_KEYSTORE_PASSWORD` 两个 Actions Secrets，密钥别名 `xianji`。本机也可以用同一密钥签名。
