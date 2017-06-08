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
        var profile = pizarra.getCurrentProfile();

        var datamap = {
            fullname: 'NOMBRE',
            birthday: 'CUMPLEANOS',
            gender: 'SEXO',
            orientation: 'ORIENTACION',
            country: 'PAIS',
            province: 'PROVINCIA',
            usstate: 'USSTATE',
            eyes: 'OJOS',
            hair: 'PELO',
            skin: 'PIEL',
            status: 'ESTADO',
            level: 'NIVEL',
            occupation: 'PROFESION',
            religion: 'RELIGION'
        };

        var fieldmap = {
            fullname: ['first_name', 'middle_name', 'last_name', 'mother_name'],
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

        $("#shadow-layer").show();

        var jsondata = '{';
        for (var prop in datamap)
        {
            var v = $("#" + prop).val();

            if (strtolower(profile[fieldmap[prop]]) != strtolower(v))
            {
                jsondata += '"' + datamap[prop] + '": "' + v + '",';

                // update local data and not call to the api
                var f = fieldmap[prop];

                if (typeof(f) == typeof([]))
                {
                    var s = split(' ', v);

                    if 	(count(s) < 4) // ignore middle name
                        f = ['first_name', 'last_name', 'mother_name'];

                    for (var i in f) profile[f[i]] = '';
                    for (var i in f) if (isset(s[i])) if (trim(s[i])!='') profile[f[i]] = s[i];

                }
                else
                    pizarra.currentProfile[fieldmap[prop]] = v;
            }
        }
        if (substr(jsondata, strlen(jsondata)-1,1)==",")
            jsondata = substr(jsondata,0,strlen(jsondata)-1);
        jsondata += '}';

        pizarra.action("submitProfile/" + base64_encode(jsondata), null, null, false);

        if ($("#picture-file").val() !='')
        {
            var picture = $("#picture").attr('src');
            var p = strpos(picture,'base64,');
            picture = substr(picture, p+7);
            pizarra.action("picture", {picture: picture});

            // TODO: the new url of public picture are unknown, recall to the api
            profile = pizarra.getCurrentProfile(true);
        }

        $("#shadow-layer").hide();

        pizarra.messageBox("Tu perfil ha sido actualizado satisfactoriamente.", "Perfil actualizado");

        refreshProfile();
    });

    $("#country").change(function(){
        showHideProvinces();
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

    $("#birthday-day").change(function(){
        buildBirthday();
    });
    $("#birthday-month").change(function(){
        buildBirthday();
    });
    $("#birthday-year").change(function(){
        buildBirthday();
    });
});

function showHideProvinces()
{
    $("#city-select").hide();
    $("#state-select").hide();

    if (strtolower($("#country").val()) == 'us')
        $("#state-select").show();

    if (strtolower($("#country").val()) == 'cu')
        $("#city-select").show();
}

function refreshProfile()
{
    var profile = pizarra.getCurrentProfile();
    if(profile !== null)
    {
        var datamap = {
            fullname: ['first_name', 'middle_name', 'last_name', 'mother_name'],
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
                    if (trim(profile[f[i]])!='')
                        v += profile[f[i]] + ' ';
            }
            else
                v = profile[f];

            $("#" + prop).val(v);

        }

        showHideProvinces();

        fillBirthday();
    }
}

function buildBirthday()
{
    var b = $("#birthday-day").val() + "/" + $("#birthday-month").val() + "/" + $("#birthday-year").val();
    $("#birthday").val(b);
}

function fillBirthday()
{
    var parts = explode("/", $("#birthday").val());
    $("#birthday-day").val(intval(parts[0]));
    $("#birthday-month").val(intval(parts[1]));
    $("#birthday-year").val(parts[2]);
}