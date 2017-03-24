var apretaste = function (pbaseUrl)
{
    if (typeof(pbaseUrl) == "undefined")
        pbaseUrl = "https://apretaste.com/";

    this.baseUrl = pbaseUrl;

    this.getData = function(pUrl, pData)
    {
        var receptor = {result: null};
        $.ajax({
            url: this.baseUrl + pUrl,
            method: 'GET',
            data: pData,
            async: false,
            complete: function(res, status) {
                if (status == "success" || status == "notmodified") {
                    eval('receptor.result = ' + res.responseText +';');
                }
            }
        });
        return receptor.result;
    };

    this.getHTML = function(pUrl){
        var receptor = {result: null};
        $.ajax({
            url: pUrl,
            method: 'GET',
            async: false,
            complete: function(res, status) {
                if (status == "success" || status == "notmodified") {
                    receptor.result = res.responseText;
                }
            }
        });
        return receptor.result;
    };

    this.login = function(email, pin)
    {
        return this.getData('api/auth', {email: email, pin: pin});
    };

    this.logout = function(token) {
        return this.getData('api/logout', {token: token});
    }

    this.run = function(subject, body, token)
    {
        return this.getData('run/api', {token: token, subject: subject, body:body});
    }
}