/**
 * Page object for Apretaste Pizarra Web
 *
 * @author @kumahacker
 * @param pProperties
 */
var pizarraPage = function(pProperties)
{
    this.name = pProperties.name;
    this.title = pProperties.title;
    this.sdk = pProperties.sdk;

    if (typeof(pProperties.show) == 'function')
        this.show = pProperties.show;
    else
        this.show = function(data, preprossesor)
        {
            if (typeof(data) == 'undefined' || data == null)
                data = {};

            if (typeof(preprossesor) == 'undefined' || preprossesor == null)
                preprossesor = function(v){return v;};

            var html = this.sdk.getHTML("pages/" + this.name + ".html");
            html = html + '<script src="pages/' + this.name + '.js"></script>';

            data = preprossesor(data);
            for(var prop in data)
            {
                html = html.replace('{{ ' + prop + ' }}', data[prop]);
            }

            $("#navbar").show();
            $(".body").html(html);
            $("#navbar-title").html(this.title);
            $('.mobile-wrapper').height($(window).height());
        };
};