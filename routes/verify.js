/**
 * Created by 国正 on 14-3-25.
 */
exports.verify = function(req,res){
    res.setHeader('content-type','application/json');
    var id = req.body.id;
    var name = req.body.name;
    if(isNullOrEmpty(id) || isNullOrEmpty(name))
    {
        var rr=
        {
            'Result':false,
            'Detail':'PARAM_INSUFFICIENT'
        };
        res.send(JSON.stringify(rr));
        res.end();
    }
    var mongodb = require('mongodb');
    var server = new mongodb.Server('localhost','27017',{auto_reconnect:true});
    var db = new mongodb.Db('xiyoumobile',server,{safe:true});
    db.open(function(err,db){
       if(err)
        console.log(err);
       else
       {
           db.collection('NewMember',function(err,collection){
              collection.find({'ID':id},function(err,result){
                if(err)
                    console.log(err);
                else
                {
                    var r = result.toArray(function(err,finalResult){
                        if(finalResult.length!=0)
                        {
                            var info = finalResult[0];
                            var des = 'SIGN_SUCCESS';
                            var last = true;
                            //console.log(info);
                            if(info.Name == name)
                            {
                                last = true;
                                des =
                                {
                                    'Name':info.Name,
                                    'Team':info.Team
                                };
                            }
                            else
                            {
                                last = false;
                                des = 'NOT_MATCH';
                            }
                            var callbackInfo=
                            {
                                'Result':last,
                                'Description':des
                            };
                            res.send(callbackInfo);
                            res.end();
                        }
                        else
                        {
                            var callbackInfo=
                            {
                                'Result':false,
                                'Description':'NOT_EXISTED'
                            };
                            res.send(callbackInfo);
                            res.end();
                        }
                    });
                }
              });
           });
       }
    });
};

function isNullOrEmpty(i) {
    if (i == "" || i == null || i.length == 0)
        return true;
    else
        return false;
}