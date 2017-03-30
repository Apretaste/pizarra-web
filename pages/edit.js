$(function(){
    $("#btnSaveData").click(function(){
        var token = client.getToken();
        if(token !== null)
        {
            var datamap = {
                fullname: 'NOMBRE',
                birthday: 'CUMPLEANOS',
                gender: 'SEXO',
                orientation: 'ORIENTACION',
                country: 'PAIS',
                province: 'PROVINCIA',
                eyes: 'OJOS',
                hair: 'PELO',
                skin: 'PIEL',
                status: 'ESTADO',
                level: 'NIVEL',
                occupation: 'PROFESION',
                religion: 'RELIGION'
            };

            for (var prop in datamap)
                client.run("PERFIL " + datamap[prop] + " " + $("#" + prop).val(), '', token);

            var p = client.getCurrentProfile(true);

            alert("profile saved");
        }
    });

    refreshProfile();
});

function refreshProfile()
{
    var profile = client.getCurrentProfile();
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
            province: 'province',
            eyes: 'eyes',
            hair: 'hair',
            skin: 'skin',
            status: 'marital_status',
            level: 'highschool_level',
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