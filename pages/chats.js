$(function(){
   refreshChats();
});

function refreshChats() {

    $("#list").html("");
    $("#new-chat").html("");
    var token = $.cookie('apretaste-pizarra');

    if (token !== null) {
        var news = [];
        var tpl = $("#new-template").html();
        var items = pizarra.run("NOTA UNREAD");
        items = items.items;
        for (var i in items) {
            var html = tpl;
            var profile = pizarra.getProfile(items[i].username);
            profile.picture_public = pizarra.checkImage(profile.picture_public);

            html = pizarra.replaceTags(html, profile, 'chat.profile.');
            html = pizarra.replaceTags(html, items[i], '');

            $("#new-chat").append(html);

            news[items[i].username] = true;
        }

        tpl = $("#template").html();
        var notes = pizarra.run('NOTA');
        notes = notes.notes;
        for (var i in notes) {
            if ( ! isset(news[notes[i].profile.username]))
            {
                var html = tpl;
                var profile = notes[i].profile;

                if (profile.picture != '1')
                    profile.picture_public = "images/user.png";

                //profile.picture_public = pizarra.checkImage(profile.picture_public);

                html = pizarra.replaceTags(html, notes[i].last_note, 'last_note.');
                html = pizarra.replaceTags(html, profile, 'chat.profile.');
                html = pizarra.replaceTags(html, notes[i], '');

                $("#list").append(html);
            }
        }
    }
}