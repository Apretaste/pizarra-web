$(function(){
    $.notify.addStyle('happyblue', {
        html: "<div><span data-notify-text/></div>",
        classes: {
            base: {
                "white-space": "nowrap",
                "background-color": "lightblue",
                "padding": "5px"
            },
            superblue: {
                "color": "white",
                "background-color": "blue"
            }
        }
    });

    $("#btnSaveData").click(function(){
        var token = pizarra.getToken();
        if(token !== null)
        {
            var datamap = {
                fullname: 'NOMBRE',
                birthday: 'CUMPLEANOS',
                gender: 'SEXO',
                orientation: 'ORIENTACION',
                country: 'PAIS',
                province: 'PROVINCIA',
                usstate: 'USSTAE',
                eyes: 'OJOS',
                hair: 'PELO',
                skin: 'PIEL',
                status: 'ESTADO',
                level: 'NIVEL',
                occupation: 'PROFESION',
                religion: 'RELIGION'
            };

            $("#shadow-layer").show();
            for (var prop in datamap)
                pizarra.run("PERFIL " + datamap[prop] + " " + $("#" + prop).val(), null,null,false);

            if ($("#picture-file").val() !='')
            {
                var picture = $("#picture").attr('src');
                pizarra.run("PERFIL FOTO", null, picture);
            }

            $("#shadow-layer").hide();

            $("#btnSaveData").notify(wordwrap(html_entity_decode('Su perfil ha sido guardado satisfactoriamente'),20,'\n',false), 'base');

            refreshProfile();
        }
    });

    $("#country").change(function(){
        $("#city-select").hide();
        $("#state-select").hide();

        if (strtolower($(this).val()) == 'us')
            $("#state-select").show();

        if (strtolower($(this).val()) == 'cu')
            $("#city-select").show();

    });

    $("#edit-image").click(function(e){
        e.preventDefault();
        $("#picture-file").trigger('click');
        $('#picture-file').bind('change', function(e){
            var files = e.target.files;
            var f = files[0];
            var reader = new FileReader();
            reader.onload = (function(f) {
                return function(e) {
                    $('#picture').attr('src', e.target.result);
                };
            })(f);
            reader.readAsDataURL(f);
        });
    });

    refreshProfile();
});

function refreshProfile()
{
    var profile = pizarra.getCurrentProfile(true);
    if(profile !== null)
    {
        var d = profile.date_of_birth;
        var dd = new Date(d);
        var y = dd.getFullYear();
        var d = dd.getDay();
        var m = dd.getMonth() + 1;
        if (y == 100)
            y = '00';
        if (d < 10) d = '0' + d;
        if (m < 10) m = '0' + m;

        profile.date_of_birth = d + '/' + m  + '/' + y;

        var datamap = {
            fullname: ['first_name', 'middle_name', 'last_name'],
            birthday: 'date_of_birth',
            gender: 'gender',
            orientation: 'sexual_orientation',
            country: 'country',
            usstate: 'usstate',
            province: 'province',
            eyes: 'eyes',
            hair: 'hair',
            skin: 'skin',
            status: 'marital_status',
            level: 'highest_school_level',
            occupation: 'occupation',
            religion: 'religion'
        };

        for (var prop in datamap)
        {
            var f = datamap[prop];
            var v = '';

            if (typeof(f) == typeof([]))
            {
                for (var i in f)
                    v += profile[f[i]] + ' ';
            }
            else
                v = profile[f];

            $("#" + prop).val(v);
        }
    }
}
