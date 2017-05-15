/**
 * Apretaste Pizarra Web Controller
 *
 * @author @kumahacker
 */

var sdk = new apretaste("https://apretaste.com/");

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
        current: {name: 'empty'},
        previous: {name: 'none'},
        login: new pizarraPage({
            name: "login",
            title: "Ingresar",
            sdk: sdk,
            showHeader: false,
            showFooter: false,
            close: function () {

            },
			entry: "/login"
        }),
        notes: new pizarraPage({
            name: "notes",
            title: "&Uacute;ltimas notas",
            sdk: sdk,
            showBtnClose: false,
            showBtnPrevious: false,
            close: function () {
                pizarra.logout();
            },
            entry: "/feed"
        }),
        chats: new pizarraPage({
            name: 'chats',
            title: "Chats",
            sdk: sdk,
            showBtnPrevious: false,
            close: function () {
                pizarra.pages.notes.show();
            },
			entry: "/chats"
        }),
        edit: new pizarraPage({
            name: 'edit',
            title: 'Editando perfil',
            sdk: sdk,
            showBtnPrevious: false,
            showBtnRefresh: false,
            close: function () {
                pizarra.pages.notes.show();
            },
			entry: "/profile"
        }),
        search: new pizarraPage({
            name: 'search',
            title: 'Resultados de b&uacute;squeda',
            sdk: sdk,
            showBtnRefresh: false,
            showBtnPrevious: false,
            close: function () {
                pizarra.pages.notes.show();
            },
			entry: "/search"
        }),
        about: new pizarraPage({
            name: 'about',
            title: 'Acerca de',
            sdk: sdk,
            close: function () {
                pizarra.pages.notes.show();
            },
			entry: "/about"
        }),
        chat: new pizarraPage({
            name: 'chat',
            title: 'Chat',
            sdk: sdk,
            showBtnPrevious: false,
            close: function () {
                pizarra.pages.notes.show();
            },
			entry: "/chat"
        }),
        terms: new pizarraPage({
            name: 'terms',
            title: 'T&eacute;rminos de uso',
            sdk: sdk,
            close: function () {
                pizarra.pages.notes.show();
            },
			entry: "/terms"
        }),
        profile: new pizarraPage({
            name: 'profile',
            title: 'Perfil',
            showBtnPrevious: false,
            showBtnRefresh: false,
            sdk: sdk,
            close: function () {
                pizarra.pages.notes.show();
            },
			entry: "/profile/{username}"
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

		if (is_null(result))
		{
            return false;
		}
		
        if (isset(result)) {
            if (result.code == 'error') {
                if (result.message == 'bad authentication') {
                    //alert('Your session was expired ');
                    this.logout();
                    return false;
                }
            }
        } else return false;

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

        var token = this.getToken();
        var profile = null;

        if (token != null)
        {
            profile = this.run('PERFIL ' + username, null, null, false);
            profile = profile.profile;

            if (isset(profile))
                if (profile.picture != '1')
                    profile.picture_public = "images/user.png";
        }

        return profile;

    },

    actionLike: function(noteId) {
        this.run('PIZARRA LIKE ' + noteId,null,null,false);
        if (isset(refreshNotes))
            refreshNotes();
    },

    actionFollow: function(username) {
        this.run('PIZARRA SEGUIR ' + username,'','',false);
        if (isset(refreshNotes))
            refreshNotes();
    },

    actionBlock: function (username) {
        $("#dialog").html('De verdad quieres bloquear a <b>@' + username + '</b>? No ver&aacute;s m&aacute;s notas suyas.');

        $("#dialog").dialog({
            title: "Bloquear usuario",
            modal: true,
            buttons: [
                {
                    text: "Si",
                    click: function() {
                        pizarra.run('PIZARRA BLOQUEAR ' + username,'','',false);
                        if (isset(refreshNotes))
                            refreshNotes();
                        $( this ).dialog( "close" );
                    }
                },
                {
                    text: "No",
                    click: function() {
                        $( this ).dialog( "close" );
                    }
                }
            ]
        });
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
	
	go: function (path)
	{		
		for (var p in this.pages)
		{
			if (isset(p.entry))
			{
				if (p.entry == path)
					p.show();
				break;
			}
		}
	}
};

$(function () {

    var session = $.cookie('apretaste-pizarra');
    var path = window.location.pathname;

    if (session == null)
    {
        pizarra.pages.login.show();
    } else
    {
        if (windows.location.pathname == "/")
            pizarra.pages.notes.show();
        else
        {
            pizarra.go(path);
        }
    }
});
