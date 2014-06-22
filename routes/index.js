
/*
 * GET home page.
 */

exports.index = function(req, res){
        res.render('index');
/*
    var date = new Date();
    var year =  date.getYear();
    var month = date.getMonth();
    var day = date.getDay();
    var hour = date.getHours();
    if(year<=2014 || month<=3 || day<=26 || hour<=20 )
    {
        res.send("<script>alert('现在还不能报名啊！');location.href='http://www.xiyoumobile.com/';</script>");
        res.end();
    }
    else
    {
        res.render('index');
    }
*/
};