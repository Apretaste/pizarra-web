$(function(){
    var token = $.cookie('apretaste-pizarra');
    if(token !== null)
    {
        var notes = sdk.run('PIZARRA','',token);
        alert(notes[0].id);
    }
});