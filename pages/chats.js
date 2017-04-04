$(function(){
   refreshChats();
});

function refreshChats() {

    $("#list").html("");

    var token = $.cookie('apretaste-pizarra');

    if (token !== null) {
        var notes = pizarra.run('NOTA');
        notes = notes.notes;
        var tpl = $("#template").html();
        for (var i in notes) {
            var html = tpl;

            for(var prop in notes[i].last_note)
                html = str_replace('{{ last_note.' + prop + ' }}', notes[i].last_note[prop], html);

            var profile = notes[i].profile;
            profile.picture_public = pizarra.checkImage(profile.picture_public);

            for(var prop in profile)
                html = str_replace('{{ chat.profile.' + prop + ' }}', profile[prop], html);

            for(var prop in notes[i])
                html = str_replace('{{ ' + prop + ' }}', notes[i][prop], html);

            $("#list").append(html);
        }
    }
}