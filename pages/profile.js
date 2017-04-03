$(function(){

    var tpl = $("#interest-template").html();

    var data = pizarra.pages.profile.data;

    for (var i in data.interests)
    {
        var html = str_replace('{{ interests.value }}', data.interests[i], tpl);
        $("#interests").append(html);
    }
});