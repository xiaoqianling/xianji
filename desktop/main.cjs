const { app, BrowserWindow, protocol, net, session } = require('electron')
const { resolve, sep } = require('node:path')
const { pathToFileURL } = require('node:url')

protocol.registerSchemesAsPrivileged([
  { scheme: 'xianji', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true } },
])

async function openWindow() {
  const window = new BrowserWindow({
    title: '弦迹 · 自学吉他',
    width: 1280,
    height: 900,
    minWidth: 370,
    minHeight: 560,
    backgroundColor: '#f2f3eb',
    autoHideMenuBar: true,
    webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false },
  })
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  window.webContents.on('will-navigate', (event) => event.preventDefault())
  await window.loadURL('xianji://app/index.html')
}

app.whenReady().then(async () => {
  // 本地协议只读取构建目录，渲染进程无需接触文件系统或 Node。
  const root = resolve(__dirname, '../dist')
  protocol.handle('xianji', (request) => {
    const url = new URL(request.url)
    try {
      const path = resolve(root, '.' + decodeURIComponent(url.pathname))
      if (url.hostname !== 'app' || !path.startsWith(root + sep)) return new Response(null, { status: 404 })
      return net.fetch(pathToFileURL(path).href)
    } catch {
      return new Response(null, { status: 400 })
    }
  })
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, respond) => respond(false))
  await openWindow()
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) void openWindow() })
}).catch((error) => {
  console.error(error)
  app.exit(1)
})
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
