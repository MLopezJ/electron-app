const { app, shell, BrowserWindow, ipcMain } = require('electron')

let win
let child

function createWindow () {
  win = new BrowserWindow({
    width: 850,
    height: 650,
    webPreferences: {
      nodeIntegration: true
    },
    backgroundColor: '#A3BEC2'
  })
 
  win.loadFile('index.html')
  
  win.webContents.on("new-window", function(event, url, frameName, disposition, options) {
    
    let urlRoute = url.split("/")
    let resource = urlRoute[urlRoute.length-1]
    event.preventDefault();
    resource == "child.html" ? createChild() : shell.openExternal(url);
  });

  win.webContents.on('did-finish-load', ()=>{
    let code = `var alertButton = document.getElementById("alert-button");
    alertButton.addEventListener("click",function(){alert("I'm learning Electron!!");});`;
    win.webContents.executeJavaScript(code);
  });
  
  win.on('closed', () => {
    
    win = null
  })
}

function createChild () {

  child = new BrowserWindow({
    parent: win,
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true
    },
    backgroundColor: '#763230'
  })

  child.loadFile('child.html')

  child.on('closed', () => {
    
    child = null
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
