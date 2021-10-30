function update_boards_info()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
    {
        var raw_data = JSON.parse(xmlHttp.responseText);
        console.log(raw_data);
        boards_data = ''
        for (var entry in raw_data)
        {
            console.log(String(raw_data[entry]).substring(0,5) == "error");
            var board_data = ''
            console.log(raw_data[entry]);
            if (String(raw_data[entry]).substring(0,5) != "error")
            {
                document.getElementById("loader_boards").style.display = 'none';
                var pad = String(raw_data[entry]["get"]).length;
                post = '<div class="board_panel">'+
                    '<div title="tytuł boarda" class="board_panel_title"><h3 style="margin-left:5px;margin-right:5px;" class="resize">'+raw_data[entry]["title"]+'</h3></div>'+
                    '<div class="board_panel_box">'+
                        '<div title="najwyższy get" class="board_panel_box_inner">'+
                            '<div class="board_panel_icon"><img src="static/images/get.png" alt="icon" /></div>'+
                            '<div class="board_panel_container"><p class="resize">'+raw_data[entry]["get"]+'</p></div>'+
                        '</div>'+
                        '<div title="najwyższy post" style="float:right;" class="board_panel_box_inner">'+
                            '<div class="board_panel_icon"><img src="static/images/post_get.png" alt="icon" /></div>'+
                            '<div class="board_panel_container"><p class="resize">'+raw_data[entry]["postget"]+'</p></div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="board_panel_box">'+
                        '<div title="aktywne posty" class="board_panel_box_inner">'+
                            '<div class="board_panel_icon"><img src="static/images/post.png" alt="icon" /></div>'+
                            '<div class="board_panel_container"><p class="resize">'+raw_data[entry]["posts"]+'</p></div>'+
                        '</div>'+
                        '<div title="posty na pontyfikat" style="float:right;" class="board_panel_box_inner">'+
                            '<div class="board_panel_icon"><img src="static/images/pontyfikat.png" alt="icon" /></div>'+
                            '<div class="board_panel_container"><p class="resize">'+raw_data[entry]["pontyfikat"]+'</p></div>'+
                        '</div>'+
                    '</div>'+
                '</div>';
                boards_data += post;
            }
        }
        var board_info_list = document.getElementById("board_info_list");
        board_info_list.innerHTML = boards_data;
        resize();
        setTimeout(function() { update_boards_info(); }, 30000);
        }
    }
    xmlHttp.open("GET", '/boardsinfo', true);
    xmlHttp.send(null);
}

setTimeout(function() { update_boards_info(); }, 1200);