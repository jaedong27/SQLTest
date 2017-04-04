var express = require('express');
var app = express();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host    :'localhost',
    port : 3306,
    user : 'root',
    password : 'apmsetup',
    database:'vml'
});

connection.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});

app.get('/:test_id',function(req,res){
    var pub_id = req.params.test_id;
    var people_id = 5;
    connection.beginTransaction(function(err) {
        if (err) {
            throw err;
        }
        connection.query('select title,authors from publications_csv WHERE id = ?', pub_id, function (err, result) {
            if (err) {
                console.error(err);
                connection.rollback(function () {
                    console.error('rollback error');
                    throw err;
                });
            }// if err
//            console.log('insert transaction log');
            //var log = {'userid': 'req.body.userid'};
            if(result.length == 0)
            {
                console.log("no value");
                return;
            }
            console.log(result.length);
            console.log(result[0].title);
            var title = result[0].title;
            console.log(result[0].authors);
            authors = result[0].authors.split('+');
            console.log(authors);
            var query_condition = "select name from people_csv WHERE";
            for (var i = 0 ; i < authors.length ; i++)
            {
                console.log(authors[i]);
                query_condition += " id=" + authors[i];
                if(i != (authors.length - 1))
                {
                    query_condition += " OR";
                }
            }
            connection.query(query_condition, function (err, result) {
                 if (err) {
                     console.error(err);
                     connection.rollback(function () {
                        console.error('rollback error');
                         throw err;
                      });
                  }// if err
                 console.log(result);
                 var authors_name = "";
                 for(var i = 0 ; i < result.length ; i++)
                 {
                     authors_name += result[i].name + " and ";
                 }
                 connection.commit(function (err) {
                    if (err) {
                        console.error(err);
                        connection.rollback(function () {
                               console.error('rollback error');
                               throw err;
                            });
                    }// if err

                    var output = "Title : " + title + "<br><br> Name" + authors_name;
                    res.send(200, output);
 
                 });// commit
                });// insert into log
        });// inset into users
    }); // begin trnsaction
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
