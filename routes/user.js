/**
 * Created by 国正 on 14-3-23.
 */
exports.getUser = function(req,res){
    res.setHeader('content-type','application/json');
    var id = req.body.id;
    if(id!=null && id!=''){
        var mongodb = require('mongodb');
        var server = new mongodb.Server('localhost','27017',{auto_reconnect:true});
        var db = new mongodb.Db('xiyoumobile',server,{safe:true});
        db.open(function(err,db){
            if(err)
                console.log(err);
            else
            {
                db.collection('ComputerSchool2013',function(err,collection){
                    if(!err)
                    {
                        collection.find({'ID':id},function(err,result){
                                if(!err)
                                {
                                    result.toArray(function(err,r)
                                    {
                                        if(r.length!=0)
                                        {
                                             var rr=
                                             {
                                                 'Result':true,
                                                 'Detail':
                                                 {
                                                    'ID':r[0].ID,
                                                    'Name':r[0].Name,
                                                    'Sex':r[0].Sex,
                                                    'Cls':r[0].Cls
                                                 }
                                             };
                                            res.send(JSON.stringify(rr));
                                            res.end();
                                        }
                                        else
                                        {
                                            var rr=
                                            {
                                                'Result':false,
                                                'Detail':'NOT_EXISTED'
                                            };
                                            res.send(JSON.stringify(rr));
                                            res.end();
                                        }
                                    });


                                }
                            }
                        );
                    }
                    else
                        console.log(err);
                });
            }
        });
    }
    else
    {
        var rr=
        {
            'Result':false,
            'Detail':'PARAM_INSUFFICIENT'
        };
        res.send(JSON.stringify(rr));
        res.end();
    }
};