var pizarraPage = function(pProperties)
{
    this.name = pProperties.name;
    this.title = pProperties.title;
    this.show = function()
    {
        var html = sdk.getHTML("pages/" + this.name + ".html");
        html = html + '<script src="pages/' + this.name + '.js"></script>';
        $(".body").html(html);
        $('.mobile-wrapper').height($(window).height());
    };
};

var pizarra = function(pSdk) {
    this.pages = {
        login: new pizarraPage({
            name: "login",
            title: "Ingresar"
        }),
        notes: new pizarraPage({
            name: "notes",
            title: "Notas"
        })
    };

    this.logout = function(){
        var session = $.cookie('apretaste-pizarra');
        if (session !== false)
        {
            sdk.logout(session);
            this.pages.login.show();
        }
    };
};


