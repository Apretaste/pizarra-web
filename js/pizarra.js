/**
 * Apretaste Pizarra Web Controller
 *
 * @author @kumahacker
 */

var sdk = new apretaste("https://xeros.co/");
//var sdk = new apretaste("http://corex.wifi/");

var pizarra = {

    /**
     * Data of current user
     *
     * @type object
     */
    currentProfile: null,

    /**
     * List of last results
     *
     * @type array
     */
    lastSearchResults: null,

    /**
     * Pages collection
     *
     */
    pages: {
        current: {},
        previous: {},
        login: new pizarraPage({
            name: "login",
            title: "Ingresar",
            sdk: sdk,
            showHeader: false,
            showFooter: false,
            close: function () {

            }
        }),
        notes: new pizarraPage({
            name: "notes",
            title: "&Uacute;ltimas notas",
            sdk: sdk,
            close: function () {
                pizarra.logout();
            }
        }),
        chats: new pizarraPage({
            name: 'chats',
            title: "Chats",
            sdk: sdk,
            close: function () {
                pizarra.pages.notes.show();
            }
        }),
        edit: new pizarraPage({
            name: 'edit',
            title: 'Editando perfil',
            sdk: sdk,
            close: function () {
                pizarra.pages.notes.show();
            }
        }),
        search: new pizarraPage({
            name: 'search',
            title: 'Resultados de b&uacute;squeda',
            sdk: sdk,
            close: function () {
                pizarra.pages.notes.show();
            }
        }),
        about: new pizarraPage({
            name: 'about',
            title: 'Acerca de',
            sdk: sdk,
            close: function () {
                pizarra.pages.notes.show();
            }
        }),
        chat: new pizarraPage({
            name: 'chat',
            title: 'Chat',
            sdk: sdk,
            close: function () {
                pizarra.pages.notes.show();
            }
        }),
        terms: new pizarraPage({
            name: 'terms',
            title: 'T&eacute;rminos de uso',
            sdk: sdk,
            close: function () {
                pizarra.pages.notes.show();
            }
        }),
        profile: new pizarraPage({
            name: 'profile',
            title: 'Perfil',
            sdk: sdk,
            close: function () {
                pizarra.pages.notes.show();
            }
        })
    },

    hookPreparseHtml: function(html) {
        var profile = this.getCurrentProfile(false);

        for(var prop in profile)
        {
            html = str_replace('{{ profile.' + prop + ' }}', profile[prop], html);
        }
        return html;
    },

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
     * Run a service
     *
     * @author @kumahacker
     * @param string subject
     * @param string body
     * @param string token
     * @returns {*}
     */
    run: function (subject, body, attachment, showLoading) {

        var token = this.getToken();

        if (!isset(subject))
            subject = 'PIZARRA';

        if (!isset(body))
            body = '';

        if (!isset(attachment))
            attachment = null;

        if (!isset(showLoading))
            showLoading = true;

        if (showLoading)
            $("#shadow-layer").show();

        var result = sdk.run(subject, body, attachment, token);

        if (showLoading)
            setTimeout('$("#shadow-layer").hide();', 1000);

        if (result.code == 'error') {
            if (result.message == 'bad authentication') {
                alert('your session was expired ' + token);
                this.logout();
                return false;
            }
        }

        return result;
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
        if (typeof (force) == 'undefined')
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

        var token = this.getToken();
        var profile = null;

        if (token != null)
        {
            profile = this.run('PERFIL ' + username, null, null, token);
            profile = profile.profile;
            profile.picture_public = pizarra.checkImage(profile.picture_public);
        }

        return profile;

    },

    actionLike: function(noteId) {
        this.run('PIZARRA LIKE ' + noteId,'','',false);
        if (isset(refreshNotes))
            refreshNotes();
    },

    actionFollow: function(username) {
        this.run('PIZARRA SEGUIR ' + username,'','',false);
        if (isset(refreshNotes))
            refreshNotes();
    },

    actionBlock: function (username) {
        this.run('PIZARRA BLOQUEAR ' + username,'','',false);
        if (isset(refreshNotes))
            refreshNotes();
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
    }

};

$(function () {

    var session = $.cookie('apretaste-pizarra');
    if (session == null)
    {
        pizarra.pages.login.show();
    } else
    {
        pizarra.pages.notes.show();
    }
});
