$(function () {
    $('#submit_button').button();
    $('#reset_button').button();
    $('#d_submit_button').button();
    $('input[type=radio]').button();

    $('input[title]').tooltip({
        position: {
            my: 'left center',
            at: 'right+5 center'
        }
    });

    //“报名查询”的click事件
    $('#seek_results').click(function () {
        $('#d_seek_results').dialog('open');
    });
    $('#d_seek_results').dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        width: 320,
        height: 240,
        buttons: {
            '查询': function () {
                var vID = document.getElementById('d_id').value.toString();
                var vName = document.getElementById('d_name').value.toString();
                var id = vID;
                if(vID=="" || vName=="")
                {
                    alert('亲，信息不完整哦！');
                    return false;
                }
                if (id.length != 8) {
                    alert('亲，你的学号好像不对哦！');
                    return false;
                }
                if (/[a-z]/.test(id)
                    || /[A-Z]/.test(id)
                    ) {
                    alert('亲，你的学号好像不对哦！');
                    return false;
                }
                $.post('/verify',
                    {
                        'id':id,
                        'name':vName
                    },
                    function(e){
                        var data = $.parseJSON(e.toString());
                        if(data.Result)
                        {
                            $('#succeed').dialog('open');
                            var ex = document.getElementById('callback_info');
                            //var stuInfo = $.parseJSON(data.Description);
                            var log;

                            switch (data.Description.Team)
                            {
                                case 'ios':log='iOS 组';break;
                                case 'android':log='Android 组';break;
                                case 'wp':log='Windows Phone 组';break;
                            }
                            ex.innerText = '欢迎，'+data.Description.Name +'报名'+log;
                        }
                        else
                        {
                            if(data.Description=='NOT_MATCH')
                            {
                                $('#fail').dialog('open');
                                var ex = document.getElementById('exception_info');
                                ex.innerText = '名字和学号不符啊！联系contact@xiyoumobile.com吧！';
                            }
                            else
                            {
                                $('#fail').dialog('open');
                                var ex = document.getElementById('exception_info');
                                ex.innerText = '你报名了么？亲！';
                            }
                        }
                    },
                    'text'
                );
            }
        }
    });


    //报名成功与否的提示对话框
    //成功的对话框
    $('#succeed').dialog({
        autoOpen: false,
        modal: true,
        resizable: false
    });
    //失败的对话框
    $('#fail').dialog({
        autoOpen: false,
        modal: true,
        resizable: false
    });
});

function autoComplete()
{
    var id = document.getElementById('id').value.toString();
    if(id!="")
    {
        $.post('/getUser',
            {
                'id':id
            },
            function(result)
            {
                var data = JSON.parse(result);
                if(data.Result==false)
                    return;
                var name = document.getElementById('name');
                name.value=data.Detail.Name;
                var cls = document.getElementById('class');
                cls.value=data.Detail.Cls;
                if(data.Detail.Sex=='男')
                {
                    /*var msx = document.getElementById('male');
                    var fsx = document.getElementById('female');
                    msx.removeAttribute('checked');
                    fsx.removeAttribute('checked');
                    msx.checked='checked';*/
                    $('#male').attr("checked",true).checkbox('refresh');
                    //$("input[id='male']").refresh();
                }
                else
                {
                   /* var msx = document.getElementById('male');
                    var fsx = document.getElementById('female');
                    msx.removeAttribute('checked');
                    fsx.removeAttribute('checked');
                    fsx.checked='checked';*/
                    $('#female').attr("checked",true).checkbox('refresh');
                }
            },
            'text'
        );
    }
}

function doConfirm() {
    var id = document.getElementById('id').value.toString();
    var name = document.getElementById('name').value.toString();
    var cls = document.getElementById('class').value.toString();
    var male = document.getElementById('male');
    var female = document.getElementById('female');
    var summary = document.getElementById('summary').value.toString();
    var sex = 'male';
    if (male.checked == true)
        sex = 'male';
    else
        sex = 'female';
    var phone = document.getElementById('phone').value.toString();
    var team;
    var teamSet = document.getElementsByName('team');
    for (var i = 0; i < teamSet.length; i++) {
        if (teamSet[i].checked == true)
            team = teamSet[i].value.toString();
    }

    if (id == "" || name == "" || cls == "" || sex == "" || phone == "" || team == "") {
        alert('亲，信息不完整哦！');
        return false;
    }
    if (id.length != 8) {
        alert('亲，你的学号好像不对哦！');
        return false;
    }
    if (/[a-z]/.test(id)
        || /[A-Z]/.test(id)
        ) {
        alert('亲，你的学号好像不对哦！');
        return false;
    }
    if (phone.length != 11) {
        alert('亲，你的电话好像不对哦！');
        return false;
    }
    if (/[a-z]/.test(phone)
        || /[A-Z]/.test(phone)
        ) {
        alert('亲，你的电话好像不对哦！');
        return false;
    }
    if(sex!='male' && sex!='female')
    {
        alert('亲，你的性别好像不对哦！');
        return false;
    }
    if(team!='ios' && team!='android' && team!='wp')
    {
        alert('亲，你的方向好像不对哦！');
        return false;
    }
    var showsex, showteam;
    switch (sex) {
        case 'male': showsex = '男'; break;
        case 'female': showsex = '女'; break;
    }
    switch (team) {
        case 'ios': showteam = 'iOS'; break;
        case 'android': showteam = 'Android'; break;
        case 'wp': showteam = 'Windows Phone'; break;
    }
    if (
    confirm('请确认信息，提交后不可修改：\n'
        + '学号：' + id + '\n'
        + '姓名：' + name + '\n'
        + '性别：' + showsex + '\n'
        + '班级：' + cls + '\n'
        + '电话：' + phone + '\n'
        + '方向：' + showteam + '\n'
    ))
    {
        doSubmit(id,name,sex,cls,phone,team,summary);
        return true;
    }
    else
        return false;
}

function showSuccess()
{
    $('#succeed').dialog({
        autoOpen: true,
        modal: true,
        resizable: false
    });
}

function showFailed()
{
    $('#fail').dialog({
        autoOpen: true,
        modal: true,
        resizable: false
    });
}


function doSubmit(id,name,sex,cls,phone,team,summary)
{
    $.post("submit",
        {
            "id":id,
            "name":name,
            "sex":sex,
            "class":cls,
            "phone":phone,
            "team":team,
            "summary":summary
        },
        function(e){
            var data = $.parseJSON(e.toString());
            if(data.Result)
            {
                showSuccess();
                var ex = document.getElementById('exception_info');
                ex.innerText ='';
                var ex1 = document.getElementById('callback_info');
                ex1.innerText = '';
            }
            else
            {
                showFailed();
                var ex = document.getElementById('exception_info');
                ex.innerText ='你的学号已经报过名了！';
            }
        },
        "text"
    );
}

function doReset()
{
    if(confirm('确实要重新填写吗？'))
    {
        location.href='/';
    }
}