/**
 * Created by 国正 on 14-3-20.
 */

exports.userInfoSubmit = function (req, res) {
    res.set('content-type', 'application/json');
    var name = req.body.name;
    var id = req.body.id;
    var cls = req.body.class;
    var sex = req.body.sex;
    var phone = req.body.phone;
    var team = req.body.team;
    var summary = req.body.summary;

    if (isNullOrEmpty(name) || isNullOrEmpty(id) || isNullOrEmpty(cls) || isNullOrEmpty(sex) || isNullOrEmpty(phone)
        || isNullOrEmpty(team)) {
        var errorResult =
        {
            "Result": false,
            "Description": "PARAM_INSUFFICIENT"
        };
        res.send(JSON.stringify(errorResult));
        res.end();
    }

    else {

        //参数正确性验证--开始
        var flag = true;
        if(id.length != 8)
            flag = false;
        if(/[a-z]/.test(id) || /[A-Z]/.test(id))
            flag = false;
        if(/[a-z]/.test(phone) || /[A-Z]/.test(phone))
            flag = false;
        if(phone.length != 11)
            flag = false;
        if(sex!='male' && sex!='female')
            flag = false;
        if(team!='ios' && team!='android' && team!='wp')
            flag = false;
        if(flag==false)
        {
            var errorResult =
            {
                "Result": false,
                "Description": "PARAM_ILLEGAL"
            };
            res.send(JSON.stringify(errorResult));
            res.end();
        }


        //参数正确性验证--结束
else
        {
        //查找数据库是否含有欲存项
        var mongodb = require('mongodb');
        var server = new mongodb.Server('localhost', '27017', { auto_reconnect: true });
        var db = new mongodb.Db('xiyoumobile', server, { safe: true });
        db.open(function (err, db) {
            if (!err) {
                db.collection('NewMember', function (err, collcetion) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        collcetion.find({ 'ID': id }, function (err, item) {
                            if (err) {
                                console.log(err);
                            }
                            var errorResult;
                            item.toArray(function (err, ele) {
                                if (ele.length == 0 ) {    //未找到，欲存项可以存储
                                    var mongodb = require('mongodb');
                                    var server = new mongodb.Server('localhost', '27017', { auto_reconnect: true });
                                    var db = new mongodb.Db('xiyoumobile', server, { safe: true });
                                    db.open(function (err, db) {
                                        if (!err) {
                                            db.collection('NewMember', function (err, collection) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                                else {
                                                    var tmp =
                                                    {
                                                        'ID': id,
                                                        'Name': name,
                                                        'Cls': cls,
                                                        'Sex': sex,
                                                        'Phone': phone,
                                                        'Team': team,
                                                        'Summary': summary
                                                    };
                                                    collection.insert(tmp, { safe: true }, function (err, result) {
                                                        if (!err) {
                                                            //console.log("Insert ");
                                                            errorResult =
                                                            {
                                                                "Result": true,
                                                                "Description": "SUBMIT_SUCCESSED"
                                                            };
                                                            res.send(JSON.stringify(errorResult));
                                                            res.end();
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else {
                                            console.log(err);
                                        }
                                    });
                                }
                                else {    //已存在，无法存储
                                    errorResult =
                                    {
                                        "Result": false,
                                        "Description": "ID_EXISTED"
                                    };
                                    res.send(JSON.stringify(errorResult));
                                    res.end();
                                }
                            });
                        });
                    }
                });
            }
            else {
                console.log(err);
            }
        });
    }
    }
};

function isNullOrEmpty(i) {
    if (i == "" || i == null || i.length == 0)
        return true;
    else
        return false;
}

