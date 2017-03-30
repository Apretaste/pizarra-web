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
            method: 'GET',
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
    this.run = function(subject, body, token)
    {
        return this.getData('run/api', {token: token, subject: subject, body:body});
    }
}