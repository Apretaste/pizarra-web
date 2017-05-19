/**
 * Apretaste Software Developer Kit
 *
 * @author @kumahacker
 * @version 1.0
 *
 * @param string pbaseUrl - Host of Apretaste REST service
 */
var apretaste = function (pbaseUrl)
{
    if (typeof(pbaseUrl) == "undefined")
        pbaseUrl = "https://apretaste.com/";

    this.baseUrl = pbaseUrl;

    /**
     * Get data via AJAX
     *
     * @author @kumahacker
     * @param string pUrl
     * @param object pParams
     * @returns object
     */
    this.getData = function(pUrl, pParams)
    {
        var receptor = {result: null};
        $.ajax({
            url: this.baseUrl + pUrl,
            method: 'POST',
            data: pParams,
            async: false,
            complete: function(res, status) {
                if (status == "success" || status == "notmodified") {
                    eval('receptor.result = ' + res.responseText +';');
                }
            }
        });
        return receptor.result;
    };

    /**
     * Get HTML via AJAX
     *
     * @author @kumahacker
     * @param string pUrl
     * @returns string
     */
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

    /**
     * Check online URL
     *
     * @param url
     * @returns {boolean}
     */
    this.checkUrl = function(url){
        try {
            var http = new XMLHttpRequest();
            http.open('HEAD', url, false);
            http.send();
            return http.status != 404;
        }
        catch(err)
        {
            return false;
        }
    }

    /**
     * Sing up on server
     *
     * @param string email
     * @returns {Object}
     */
    this.start = function(email)
    {
        return this.getData('api/start', {email: email});
    };

    /**
     * Log on server
     *
     * @param string email
     * @param string pin
     * @returns {Object}
     */
    this.login = function(email, pin)
    {
        return this.getData('api/auth', {email: email, pin: pin});
    };

    /**
     * Logout from server
     *
     * @author @kumahacker
     * @param token
     * @returns {Object}
     */
    this.logout = function(token) {
        return this.getData('api/logout', {token: token});
    }

    /**
     * Run service
     *
     * @param string subject
     * @param string body
     * @param string token
     * @returns {Object}
     */
    this.run = function(subject, body, attachment, token)
    {
        var params = {};
        if (isset(subject)    && subject != null    && subject != '')    params.subject = subject;
        if (isset(body)       && body != null       && body != '')       params.body = body;
        if (isset(attachment) && attachment != null && attachment != '') params.attachment = attachment;
        if (isset(token)      && token != null      && token != '')      params.token = token;
        return this.getData('run/api', params);
    }
}
