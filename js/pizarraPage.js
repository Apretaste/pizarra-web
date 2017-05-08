/**
 * Page object for Apretaste Pizarra Web
 *
 * @author @kumahacker
 * @param pProperties
 */
var pizarraPage = function(pProperties, parent)
{

    var p = pProperties;
    this.data = {};
    this.name = p.name;
    this.title = p.title;
    this.sdk = p.sdk;
    this.close = p.close;
    this.showHeader = isset(p.showHeader) ? p.showHeader : true;
    this.showFooter = isset(p.showFooter) ? p.showFooter : true;
    this.showBtnClose = isset(p.showBtnClose) ? p.showBtnClose : true;
    this.showBtnPrevious = isset(p.showBtnPrevious) ? p.showBtnPrevious : true;
    this.showBtnRefresh = isset(p.showBtnRefresh) ? p.showBtnRefresh : true;
    this.parent = parent;

    if (typeof(p.show) == 'function')
        this.show = p.show;
    else
        this.show = function(data, preprossesor) {
            $("#btnClose").hide();
            $("#btnPrevious").hide();
            $("#btnRefresh").hide();
            if (this.showBtnClose) $("#btnClose").show();
            if (this.showBtnPrevious) $("#btnPrevious").show();
            if (this.showBtnRefresh) $("#btnRefresh").show();

            if (typeof(data) == 'undefined' || data == null)
                data = {};

            if (typeof(preprossesor) == 'undefined' || preprossesor == null)
                preprossesor = function (v) {
                    return v;
                };

            var html = this.sdk.getHTML("pages/" + this.name + ".html");

            html = (this.showHeader ? $("#header-tpl").html() : "") + html + '<script src="pages/' + this.name + '.js"></script>';

            html = pizarra.hookPreparseHtml(html);

            data = preprossesor(data);

            this.data = data;

            for (var prop in data) {
                html = str_replace('{{ ' + prop + ' }}', data[prop], html);
            }

            // imporatant! this section before load html and js
            // -- section
            if (pizarra.pages.previous.name != pizarra.pages.current.name)
                pizarra.pages.previous = pizarra.pages.current;
            pizarra.pages.current = this;
            // -- end section



            $("#main-stack").html(html);
            if (this.showHeader) $("#main-stack #navbar").show();
            //$("#main-stack #navbar-title").html(this.title);
            $('.mobile-wrapper').height($(window).height());

            $(".body").slimscroll({
                alwaysVisible: false,
                allowPageScroll: true,
                height: 'auto',
                railVisible: true
            });

            $(".page-top-buttons").hide();

            try {
                $(".page-" + this.name + "-buttons").show();
            } catch (e){}

            window.scrollTo(0, 0);
        };

    this.refresh = function()
    {
        this.show(this.data);
    }
};