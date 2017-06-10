/**
 * Apretaste Pizarra Web Controller
 *
 * @author @kumahacker
 */


// ------------------ Some functions ------------------- //
/**
 * Clone isset() PHP function
 */
function isset(v){
    return typeof v !== 'undefined';
}

function is_email(emailAddress) {
    var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
    var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
    var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
    var sQuotedPair = '\\x5c[\\x00-\\x7f]';
    var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
    var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
    var sDomain_ref = sAtom;
    var sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
    var sWord = '(' + sAtom + '|' + sQuotedString + ')';
    var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
    var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
    var sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
    var sValidEmail = '^' + sAddrSpec + '$'; // as whole string

    var reValidEmail = new RegExp(sValidEmail);

    return reValidEmail.test(emailAddress);
}

if(!String.linkify) {
    String.prototype.linkify = function(target) {
        if (!isset(target))
            target = "_blank";

        // http://, https://, ftp://
        var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        // www. sans http:// or https://
        var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

        // Email addresses
        var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

        return this
            .replace(urlPattern, '<a target="'+target+'" href="$&">$&</a>')
            .replace(pseudoUrlPattern, '$1<a target="'+target+'" href="http://$2">$2</a>');
        /*.replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');*/
    };
}

// ------------------- pizarra controller ------------------ //
var pizarra = {

    baseUrl: "",

    /**
     * Data of current user
     *
     * @type object
     */
    currentProfile: null,

    /**
     * List of notes of current chat
     *
     * @type Array
     */
    currentChat: {code: "ok", last_id: 0, friendUsername: null, chats: []},

    /**
     * List of last results
     *
     * @type Array
     */
    lastSearchResults: null,

    /**
     * Logout
     *
     * @author @kumahacker
     */
    logout: function () {
        var session = $.cookie('apretaste-pizarra');
        if (session !== false) {
            sdk.logout(session);
            $.cookie('apretaste-pizarra', null);
            this.pages.login.show();
        }
    },

    /**
     * Get HTML via AJAX
     *
     * @author @kumahacker
     * @param string pUrl
     * @returns string
     */
    getHTML: function(pUrl){
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
    },

    /**
     * Get data via AJAX
     *
     * @author @kumahacker
     * @param string pUrl
     * @param object pParams
     * @returns object
     */
    getData: function(pUrl, pParams, async, callback)
    {
        if ( ! isset(async))
            async = false;

        if (!isset(callback))
            callback = function(result){};

        var receptor = {result: null};

        $.ajax({
            url: this.baseUrl + pUrl,
            method: 'POST',
            data: pParams,
            async: async,
            complete: function(res, status) {
                if (status == "success" || status == "notmodified") {
                    eval('receptor.result = ' + res.responseText +';');

                    if (typeof(callback) == "function")
                        callback(receptor.result);

                    if (typeof(callback) == "string")
                        eval(callback);
                }
            }
        });

        return receptor.result;
    },

    /**
     * Check online URL
     *
     * @param url
     * @returns {boolean}
     */
    checkUrl: function(url){
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
    },

    /**
     * Save token in cookies
     *
     * @author @kumahacker
     * @param token
     */
    setToken: function (token) {
        $.cookie('apretaste-pizarra', token, {expires: 30});
    },

    /**
     * Get token from cookies
     *
     * @author @kumahacker
     * @returns {String|*}
     */
    getToken: function () {
        return $.cookie('apretaste-pizarra');
    },

    /**
     * Load data of current profile
     *
     * @author @kumahacker
     * @param boolean force Forcing request to server
     * @returns {Object}
     */
    getCurrentProfile: function (force) {
        if (!isset(force))
            force = false;

        if (this.currentProfile == null || force == true) // singleton
        {
            this.currentProfile = this.getProfile();
        }

        return this.currentProfile;
    },

    getProfile: function(username) {

        if (!isset(username))
            username = '';

        var profile = null;
        profile = this.action('profile/' + username, null, false, false);
        profile = profile.profile;

        var d = profile.date_of_birth;
        if (strpos(d, '-') !== false)
        {
            var parts = explode('-', d);
            var y = parts[0];
            var m = parts[1];
            var d = parts[2];
            profile.date_of_birth = d + '/' + m  + '/' + y;
        }

        return profile;

    },

    checkImage: function (imgUrl)
    {
        var d = 'images/user.png';
        if (trim(imgUrl) == "")
            return d;

        if (sdk.checkUrl(imgUrl) == false)
            imgUrl = d;

        return imgUrl;
    },

    replaceTags: function(tpl, data, prefix, suffix){

        if (!isset(prefix))
            prefix = '';

        if (!isset(suffix))
            suffix = '';

        var html = tpl;

        for(var tag in data)
            html = str_replace('{{ ' + prefix + tag + suffix +' }}', data[tag], html);

        return html;
    },

    showPreviousPage: function(){
        if (isset(this.pages.previous.name))
            this.pages.previous.refresh();
    },

    ajax: function(path, params, showLoading, async, callback){
        if (!isset(showLoading))
            showLoading = true;

        if (showLoading)
            $("#shadow-layer").show();

        if (showLoading)
            setTimeout('$("#shadow-layer").hide();', 1000);

        return this.getData(path, params, async, callback);
    },

    action: function(a, params, showLoading, async, callback){
        var result = this.ajax("/action/" + a, params, showLoading, async, callback);

        if ( ! isset(async))
            async = false;

        if (async == false)
            if ( ! is_null(result))
            {
                if ( ! isset(result.payload))
                    return {code: 215, message: "error", payload: {}}

                return result.payload;
            }
            else
                return {code: 500, message: 'server error', payload: {}}
    },

    submit: function(a, params, showLoading){
        return this.ajax("/submit/" + a, params, showLoading);
    },

    reEvents: function()
    {
        $("a.action").click(function(){

            var action = $(this).attr("data-action");
			var action_name = explode('/', action);
			action_name = action_name[0];
            var param = $(this).attr("data-param");
            var showLoading = $(this).attr("data-show-loading");
            var callback = $(this).attr("data-callback");
            var xconfirm = $(this).attr("data-confirm");

            param = typeof(param) == "undefined"? "null" : param;
            param = eval(param);

            showLoading = typeof(showLoading) == "undefined"? "false" : showLoading;
            showLoading = showLoading == "true" ? true : false;

            xconfirm = typeof(xconfirm) == "undefined"? "false": xconfirm;
            xconfirm = xconfirm == "true" ? true : false;

            if (xconfirm == true)
            {
                var title = $(this).attr("data-confirm-title");
                var msg = $(this).attr("data-confirm-msg");
                $("#dialog").html(msg);

                $("#dialog").dialog({
                    title: title,
                    modal: true,
                    buttons: [
                        {
                            text: "Si",
							class: "btn-yes-dialog btn-action-yes-" + action_name,
                            click: function() {
                                pizarra.action(action, param, showLoading, true, callback);
                                $(this).dialog( "close" );
                            }
                        },
                        {
                            text: "No",
							class: "btn-no-dialog btn-action-no-" + action_name,
                            click: function() {
                                $(this).dialog( "close" );
                            }
                        }
                    ]
                });
            }
            else
            {
                pizarra.action(action, param, showLoading, true, callback);
                //callback = typeof(callback) == "undefined"? "null" : callback;
                //callback = eval(callback);
            }
        });
    },

    redirect: function(path)
    {
		$("#shadow-layer").show();
        window.location.pathname = "/" + path;
    },

    messageBox: function (message, title, callback)
    {
        if (!isset(callback))
            callback = function(){};

        $("#dialog").html(message);
        $("#dialog").dialog({
            title: title,
            modal: true,
            buttons: [
                {
                    text: "Aceptar",
                    click: function() {
                        callback();
                        $( this ).dialog( "close" );
                    }
                }
            ]
        });
    }
};

$(function(){
    $('.mobile-wrapper').height($(window).height());

    $(".body").slimscroll({
        alwaysVisible: false,
        allowPageScroll: true,
        height: 'auto',
        railVisible: true
    });

    window.scrollTo(0, 0);
});