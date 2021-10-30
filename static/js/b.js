function update_b()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            if (String(xmlHttp.responseText).substring(0,5) != "error")
            {
                document.getElementById("loader_b").style.display = "none";
                document.getElementById("b_content").style.display = "block";

                var raw_data = JSON.parse(xmlHttp.responseText);
                document.getElementById("b_get").innerHTML = raw_data["get"]
                document.getElementById("b_get_href").href = "https://karachan.org/b/res/" +raw_data["postget"] + ".html#q" + raw_data["get"]
                document.getElementById("b_pontyfikat").innerHTML = raw_data["pontyfikat"]
                document.getElementById("b_active").innerHTML = raw_data["posts"]
                document.getElementById("b_title").innerHTML = raw_data["title"]
            }else
            {
                document.getElementById("loader_b").style.display = "block";
                document.getElementById("b_content").style.display = "none";
            }

            setTimeout(function() { update_b(); }, 1000);
        }
    }
    xmlHttp.open("GET", '/boardinfo/b', true);
    xmlHttp.send(null);
}
setTimeout(function() { update_b(); }, 1200);