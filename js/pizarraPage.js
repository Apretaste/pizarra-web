/**
 * Page object for Apretaste Pizarra Web
 *
 * @author @kumahacker
 * @param pProperties
 */
var pizarraPage = function(pProperties)
{
    var p = pProperties;
    this.name = p.name;
    this.title = p.title;
    this.sdk = p.sdk;
    this.onClose = p.onClose;
    this.showHeader = isset(p.showHeader) ? p.showHeader : true;
    this.showFooter = isset(p.showFooter) ? p.showFooter : true;

    if (typeof(p.show) == 'function')
        this.show = p.show;
    else
        this.show = function(data, preprossesor) {
            if (typeof(data) == 'undefined' || data == null)
                data = {};

            if (typeof(preprossesor) == 'undefined' || preprossesor == null)
                preprossesor = function (v) {
                    return v;
                };

            var html = this.sdk.getHTML("pages/" + this.name + ".html");

            html = (this.showHeader ? $("#header-tpl").html() : "") + html + '<script src="pages/' + this.name + '.js"></script>';

            data = preprossesor(data);
            for (var prop in data) {
                html = html.replace('{{ ' + prop + ' }}', data[prop]);
            }

            $("#main-stack").html(html);
            if (this.showHeader) $("#main-stack #navbar").show();
            $("#main-stack #navbar-title").html(this.title);
            $('.mobile-wrapper').height($(window).height());

            client.pages.current = this;

        };
};