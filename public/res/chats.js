$(function(){
   refreshChats();
});

function refreshChats() {

    $("#list").html("");
    $("#new-chat").html("");
    var token = $.cookie('apretaste-pizarra');

    if (token !== null) {
		var items = pizarra.run("NOTA UNREAD");
		var notes = pizarra.run('NOTA');
		notes = notes.notes;
		items = items.items;
		
		if (count(items) + count(notes) == 0)
        {
			$("#shadow-layer").hide();
			$("#dialog").html("No tienes conversaciones pendientes");
            $("#dialog").dialog({
                title: "Chats",
				modal: true,
				buttons: [
					{
						text: "Cerrar",
						click: function(){
							$(this).dialog('close');
							pizarra.pages.current.close();
						}
					}
				]
			});
			return;
        }
		
        var news = [];
        var tpl = $("#new-template").html();
        
        
        for (var i in items) {
            var html = tpl;
            var profile = pizarra.getProfile(items[i].username);

            if (profile.picture != '1')
                profile.picture_public = "images/user.png";

            html = pizarra.replaceTags(html, profile, 'chat.profile.');
            html = pizarra.replaceTags(html, items[i], '');

            $("#new-chat").append(html);

            news[items[i].username] = true;
        }

        tpl = $("#template").html();
        
        
        for (var i in notes) {
            if ( ! isset(news[notes[i].profile.username]))
            {
                var html = tpl;
                var profile = notes[i].profile;

                if (profile.picture != '1')
                    profile.picture_public = "images/user.png";

                html = pizarra.replaceTags(html, notes[i].last_note, 'last_note.');
                html = pizarra.replaceTags(html, profile, 'chat.profile.');
                html = pizarra.replaceTags(html, notes[i], '');

                $("#list").append(html);
            }
        }
    }
}