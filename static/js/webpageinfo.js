var host = document.getElementById("host");
var service = document.getElementById("service");
var host_href = document.getElementById("host_href");

var response_time = document.getElementById("response_time");
var uptime = document.getElementById("uptime");

var loader_server = document.getElementById("loader_server");
var server_list = document.getElementById("server_list");

function update_webpage_info()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
    {
        if (String(xmlHttp.responseText).substring(0,5) != "error")
        {
            var data = JSON.parse(xmlHttp.responseText);

            host.innerHTML = data["host"];
            host_href.href = data["host"];
            service.innerHTML = data["service"]
            response_time.innerHTML = data["response"];
            uptime.innerHTML = data["uptime"];

            loader_server.style.display = "none";
            server_list.style.display = "block";
        }
        else
        {
            loader_server.style.display = "block";
            server_list.style.display = "none";
        }
    setTimeout(function() { update_webpage_info(); }, 1000);
    }
}
xmlHttp.open("GET", '/karainfo', true);
xmlHttp.send(null);
}
setTimeout(function() { update_webpage_info(); }, 50);