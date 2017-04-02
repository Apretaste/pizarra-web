/**
 * Apretaste Pizarra Web Controller
 *
 * @author @kumahacker
 * @param apretaste pSdk
 */
var pizarra = function(pSdk) {

    this.sdk = pSdk;

    /**
     * Pages collection
     *
     * @type {{login: pizarraPage, notes: pizarraPage, chats: pizarraPage, edit: pizarraPage}}
     */
    this.pages = {
        current: {},
        login: new pizarraPage({
            name: "login",
            title: "Ingresar",
            sdk: pSdk,
            showHeader: false,
            showFooter: false,
            onClose: function(){

            }
        }),
        notes: new pizarraPage({
            name: "notes",
            title: "&Uacute;ltimas notas",
            sdk: pSdk,
            onClose: function(){
                client.logout();
            }
        }),
        chats: new pizarraPage({
            name: 'chats',
            title: "Chats",
            sdk: pSdk,
            onClose: function(){
                client.pages.notes.show();
            }
        }),
        edit: new pizarraPage({
            name: 'edit',
            title: 'Editando perfil',
            sdk: pSdk,
            onClose: function(){
                client.pages.notes.show();
            }
        }),
        search: new pizarraPage({
            name: 'search',
            title: 'Resultados de b&uacute;squeda',
            sdk: pSdk,
            onClose: function(){
                client.pages.notes.show();
            }
        }),
        about:  new pizarraPage({
            name: 'about',
            title: 'Acerca de',
            sdk: pSdk,
            onClose: function(){
                client.pages.notes.show();
            }
        }),
        chat: new pizarraPage({
            name: 'chat',
            title: 'Chat',
            sdk: pSdk,
            onClose: function(){
                client.pages.notes.show();
            }
        }),
        terms: new pizarraPage({
            name: 'terms',
            title: 'T&eacute;rminos de uso',
            sdk: pSdk,
            onClose: function(){
                client.pages.notes.show();
            }
        })
    };

    /**
     * Logout
     *
     * @author @kumahacker
     */
    this.logout = function () {
        var session = $.cookie('apretaste-pizarra');
        if (session !== false) {
            this.sdk.logout(session);
            $.cookie('apretaste-pizarra', null);
            this.pages.login.show();
        }
    };

    /**
     * Run a service
     *
     * @author @kumahacker
     * @param string subject
     * @param string body
     * @param string token
     * @returns {*}
     */
    this.run = function (subject, body, token)
    {

        if (typeof(token) == 'undefined' || token == null || token == '')
            token = this.getToken();

        var result = this.sdk.run(subject, body, token);

        if (result.code == 'error')
        {
            if (result.message == 'bad authentication')
            {
                alert('your session was expired ' + token);
                this.logout();
                return false;
            }
        }

        return result;
    }

    /**
     * Save token in cookies
     *
     * @author @kumahacker
     * @param token
     */
    this.setToken = function(token)
    {
        $.cookie('apretaste-pizarra', token, { expires: 30 });
    }

    /**
     * Get token from cookies
     *
     * @author @kumahacker
     * @returns {String|*}
     */
    this.getToken = function()
    {
        return $.cookie('apretaste-pizarra');
    }

    /**
     * Data of current user
     *
     * @type object
     */
    this.currentProfile = null;

    /**
     * Load data of current profile
     *
     * @author @kumahacker
     * @param boolean force Forcing request to server
     * @returns {Object}
     */
    this.getCurrentProfile = function(force)
    {
        if (typeof (force) == 'undefined')
            force = false;

        if (this.currentProfile == null || force == true) // singleton
        {
            var token = this.getToken();
            var profile = null;
            if (token != null)
            {
                profile = this.run('PERFIL', '', token);
                profile = profile.profile;
            }

            // proccess picture

            var pic = profile.picture;
            profile.picture_original = pic;

            if (pic == "" || pic == null || pic == '0' || pic == 0)
                pic = "/images/user.png";
            else
            {
                if (pic == true || pic == 1 || pic == '1')
                    pic = this.sdk.baseUrl + "profile/" + profile.email + ".jpg";
                else
                    pic = this.sdk.baseUrl + "profile/" + pic + ".jpg";
            }

            profile.picture = pic;
            this.currentProfile = profile;
        }

        return this.currentProfile;
    }
};


