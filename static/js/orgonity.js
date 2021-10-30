var orgonity_hours = document.getElementById("orgonity_hours");
var orgonity_minutes = document.getElementById("orgonity_minutes");
var orgonity_seconds = document.getElementById("orgonity_seconds");

function update_orgonity()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            var json = JSON.parse(xmlHttp.responseText);
            const zeroPad = (num, places) => String(num).padStart(places, '0')
            orgonity_hours.innerHTML = zeroPad(parseInt(json["days"])*24+parseInt(json["hours"]), 2);
            orgonity_minutes.innerHTML = zeroPad(parseInt(json["minutes"]), 2);;
            orgonity_seconds.innerHTML = zeroPad(parseInt(json["seconds"]), 2);;
            setTimeout(function() { update_orgonity(); }, 1000);
        }
    }
    xmlHttp.open("GET", '/orgonity', true);
    xmlHttp.send(null);
}
setTimeout(function() { update_orgonity(); }, 100);