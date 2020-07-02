var mysql = require('mysql');

function dbConnect() {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    port: '3306',
    database: 'calendar'
  });
  connection.connect(function (error) {
    if (!error) {
      return error;
    }
  });
  connection.query('USE calendar');
  return connection;
}

function setEvent(user, title, description, start, end, color, userIds, connection) {
  var query = 'INSERT INTO  Event  (userid, title, description, start, end, color) values (' + user + ', "' + title + '", "' + description + '", "' + start + '", "' + end + '", "' + color + '")';
  connection.query(query, function (response) {
    if (userIds !== []) {
      for (userIndex = 0; userIndex < userIds.length; userIndex++) {
        var query = 'INSERT INTO  invited  (userid, eventid) values (' + userIds[userIndex] + ', ' + response.insertId+ ')';
        var invite = connection.query(query);
      }
    }
  });
  return 0;
}

function updateEvent(id, title, description, start, end, userIds, connection) {
  var query = 'UPDATE Event  SET  title= "' + title + '", description= "' + description +'", start= "' + start +  '", end="' + end + '" where id=' + id;
  connection.query(query, function () {
    var deleteQuery = 'DELETE FROM invited where eventid=' + id;
    var deleteInvite = connection.query(deleteQuery);
    if (userIds !== []) {
      for (userIndex = 0; userIndex < userIds.length; userIndex++) {
        var query = 'INSERT INTO  invited  (userid, eventid) values (' + userIds[userIndex] + ', ' + id + ')';
        var invite = connection.query(query);
      }
    }
  });
  return 0;
}

module.exports = {
  connection: dbConnect(),
  setEvent: setEvent,
  updateEvent: updateEvent
};