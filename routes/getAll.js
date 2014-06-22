/**
 * Created by 国正 on 14-3-27.
 */

exports.getAll = function(req,res){
    res.setHeader('content-type','application/json');
    var user,key;
    try{
        user = req.body.user;
        key = req.body.ukey;
    }
    catch (e)
    {
        console.log(e);
    }

    if(user!='xiyou' || key!='xiyou3g*//')
    {
        console.log('Fuck');
        res.end();
    }
    else
    {
    var mongodb = require('mongodb');
    var server = new mongodb.Server('localhost','27017',{autoReconnect:true});
    var db = new mongodb.Db('xiyoumobile',server,{safe:true});
    db.open(function(err,db){
       db.collection('NewMember',function(err,collection){
          collection.find({},function(err,result){
              result.toArray(function(err,data){
                  var str = JSON.stringify(data);
                  res.send(str);
                  res.end();
              });
          }) ;
       });
    });
    }
};