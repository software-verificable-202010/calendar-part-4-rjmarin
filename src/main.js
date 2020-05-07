// Modules to control application life and create native browser window
const  {app, BrowserWindow, ipcMain, remote} = require('electron');
const path = require('path');
const  setEvent  = require(path.resolve('src/scripts/dbProvider.js')).setEvent;
const  connection  = require(path.resolve('src/scripts/dbProvider.js')).connection;

//return randoom background color
function random_bg_color() {
  var x = Math.floor(Math.random() * 256);
  var y = Math.floor(Math.random() * 256);
  var z = Math.floor(Math.random() * 256);
  var bgColor = "rgb(" + x + "," + y + "," + z + ")";
  return bgColor;
}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900, 
    webPreferences: {
      nodeIntegration: true,
    }
 
  });
  
  // and load the index.html of the app.
  mainWindow.loadFile('src/views/index.html');
  

}


//set event with title, description, date, background color
ipcMain.on('add-event', function(e, title, description, start, end){
  console.log("main", title , description, start, end);
  setEvent(title , description, start, end, random_bg_color(), connection);
});


//get all events to show in calendar
ipcMain.on('get-event', function(e){
  connection.query('Select * FROM  Event',
     (error, results,fields) =>{
      if (error) throw error;  
      events = results;
      e.returnValue = events;
    });

});






// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
  
 
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

