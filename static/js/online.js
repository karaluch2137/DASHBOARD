var online_counter = document.getElementById("online");
function update_online_counter()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
    {
        if (String(xmlHttp.responseText).substring(0,5) != "error")
        {
            document.getElementById("loader_online").style.display = "none";
            document.getElementById("wrapper_online").style.display = "block";
            online_counter.innerHTML = xmlHttp.responseText;
        }
        else
        {
            document.getElementById("loader_online").style.display = "block";
            document.getElementById("wrapper_online").style.display = "none";
        }
        setTimeout(function() { update_online_counter(); }, 3000);
    }
}
xmlHttp.open("GET", '/usercount', true);
xmlHttp.send(null);
}
setTimeout(function() { update_online_counter(); }, 3000);