const electron = require('electron')
const url = require('url')
const path = require('path')

const {app, BrowserWindow, Menu, ipcMain} = electron

process.env.NODE_ENV = 'production'

let mainWindow

app.on('ready', function(){
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadURL(
    url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
  }))
  mainWindow.on('closed', function(){
    app.quit()
  })
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu)
})

function createConfigureKeyboardWindow()
{
  configureKeyboardWindow = new BrowserWindow({
    width: 300,
    height: 600,
    title: 'Configure Keyboard',
    webPreferences: {
      nodeIntegration: true
    }
  })
  configureKeyboardWindow.loadURL(
    url.format({
        pathname: path.join(__dirname, 'configureKeyboard.html'),
        protocol: 'file',
        slashes: true
  }))

  configureKeyboardWindow.on('close', function(){
    configureKeyboardWindow = null
  })
}

function createConfigureGamepadWindow()
{
  configureGamepadWindow = new BrowserWindow({
    width: 300,
    height: 600,
    title: 'Configure Gamepad',
    webPreferences: {
      nodeIntegration: true
    }
  })
  configureGamepadWindow.loadURL(
    url.format({
        pathname: path.join(__dirname, 'configureGamepad.html'),
        protocol: 'file',
        slashes: true
  }))

  configureGamepadWindow.on('close', function(){
    configureGamepadWindow = null
  })
}

ipcMain.on('create-configure-keyboard-window', (event) => {
  createConfigureKeyboardWindow()
});

ipcMain.on('create-configure-gamepad-window', (event) => {
  createConfigureGamepadWindow()
});

const mainMenuTemplate = [
  {
    label: 'File',
    submenu:[
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit()
        }
      }
    ]
  }
]

if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({})
}

if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools()
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}