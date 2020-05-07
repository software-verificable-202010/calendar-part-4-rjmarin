var mysql = require('mysql');

  function dbConnect(){
    var connection =  mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'password',
      database : 'calendar'
  });
   connection.connect(function(error){
    if(!!error){
      return error;
    }
  });
  connection.query('USE calendar', 
  function (error, results) {
    if (error) throw error;  
  });
  var exist = true;
  connection.query('SHOW TABLES LIKE "Event"', 
  function (error, results) {
    if (error) {
        exist = false;
    }
    exist = true;
  });
  if(!exist){
    connection.query('CREATE TABLE Event  (title varchar(30), description varchar(200), start datetime, end datetime, color varchar(40))', 
      function (error, results,fields) {
      if (error) throw error;
      console.log(error, results);
       
    });  
  }
  return connection;
  }



function setEvent(title, description, start, end,color, connection ) {
    connection.query('INSERT INTO  Event  (title , description , start , end , color ) values ("'
    + title +'", "' + description + '", "' + start +'", "' +  end+ '", "' +  color +'")', 
        function (error, results) {
        if (error) throw error;     
    }); 
    
}

  

module.exports= {connection : dbConnect(), setEvent: setEvent};
