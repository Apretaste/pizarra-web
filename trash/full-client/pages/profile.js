$(function(){

    var tpl = $("#interest-template").html();

    var data = pizarra.pages.profile.data;

    if (!isset(data.interests))
        $(".interests-title").hide();

    if (count(data.interests) > 0)
        $(".interests-header").show();

    for (var i in data.interests)
    {
        var html = str_replace('{{ interests.value }}', data.interests[i], tpl);
        $("#interests").append(html);
    }

    $("#btnActionFollow").click(function(){
        pizarra.actionFollow($(this).attr('tag'));
        $(this).hide();
    });

    if (isset(data.follow))
        if (data.follow == true)
        {
            $("#btnActionFollow").hide();
        }
});