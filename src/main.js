// Modules to control application life and create native browser window
const  { app, BrowserWindow, ipcMain, remote } = require('electron');
const path = require('path');
const  connection  = require(path.resolve('src/scripts/dbProvider.js')).connection;
const  setEvent  = require(path.resolve('src/scripts/dbProvider.js')).setEvent;
const  updateEvent  = require(path.resolve('src/scripts/dbProvider.js')).updateEvent;
var user;


function randomBgColor () {
  var x = Math.floor(Math.random() * 256);
  var y = Math.floor(Math.random() * 256);
  var z = Math.floor(Math.random() * 256);
  var bgColor = 'rgb(' + x + ',' + y + ',' + z + ')';
  return bgColor;
}

function createWindow () {
  var mainWindow = new BrowserWindow({
    width: 1200,
    height: 900, 
    webPreferences: {
      nodeIntegration: true
    }
  });
  var login = new BrowserWindow({
    parent: mainWindow,
    width:400,
    height:300,
    frame:false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  login.loadFile('src/views/login.html');
  login.on('closed', function () {
    mainWindow.loadFile('src/views/index.html');
  });
}

ipcMain.on('add-event', function (e,title, description, start, end, userIds) {
  setEvent(user.id, title, description, start, end, user.color, userIds, connection);
});

ipcMain.on('update-event', function (e, eventId, title, description, start, end, userIds) {
  updateEvent(eventId, title, description, start, end, userIds, connection);
});

ipcMain.on('get-events', function (e) {
  if (user === undefined) {
    connection.query('Select * FROM  Event where userid = -1',
     function (error, results ) {
      if (error) throw error;  
      events = results;
      if ( events.length > 0 ){
        e.returnValue = events;
      } else {
        e.returnValue = [];
      }
    });
  } else {
    connection.query('Select distinct e.* FROM  event e, invited i where e.userid ='+ 
    user.id +' or (i.eventid=e.id and i.userid =' + user.id + ')', 
      function (error, results ) {
        if (error) throw error;  
        events = results;
        if ( events.length > 0){
          e.returnValue = events;
        } else {
          e.returnValue = [];
        }
    }); 
  } 
});

ipcMain.on('get-users', function (e) {
  connection.query('Select * FROM  user where id !=' + user.id,
  function (error, results ) {
    if (error) throw error;  
    users = results;
    if ( users.length > 0){
      e.returnValue = users;
    } else {
      e.returnValue = [];
    }
  });
}); 

ipcMain.on('delete-event', function (e, id) {
  connection.query('Delete  FROM  event where id= ' + id,
  function (error) {
    if (error) throw error;  
  });
}); 

ipcMain.on('event-request', function (e, id) {
  var guests;
  connection.query('Select * FROM  event where id = ' + id,
  function (error, results ) {
    if (error) throw error;  
    event = results;
    if ( event.length > 0){
      query = 'Select userid from invited where eventid=' + id;
      connection.query(query, function (err, results) {
        if (error) throw error;  
        guests = results;
      });
      ipcMain.on('get-window-request', function (e) {
        e.sender.send('event', event);
        e.sender.send('guest', guests);
      });
    } else {
      e.sender.send('event', []);  
    }
  });
}); 

ipcMain.on('login', function (e, userName) {
  connection.query('select * from user where username = "' + userName + '"', 
  function (error, result) {
    if (error) {
      console.log("consulta");
      throw error;
    }
    if (result.length === 0) {
      connection.query('INSERT INTO  user  (username, color) values ("' + 
      userName + '", "' + randomBgColor() + '" )', 
      function (error, result) {
        if (error) throw error;  
        user = result[0];
    }); 
    } else {
      user = result[0];
    }
  });
  e.returnValue = user;
});

ipcMain.on("user-logged", function (e) {
  e.returnValue = user;
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

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





