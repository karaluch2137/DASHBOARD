let pontifikat_chart = document.getElementById('pontyfikat_chart').getContext('2d');
pontifikat_chart.canvas.width  = window.innerWidth;
pontifikat_chart.canvas.height = window.innerHeight;

Chart.defaults.global.defaultFontColor = '#c9c6cf';

Chart.defaults.global.tooltipFontFamily = "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
Chart.defaults.global.tooltipFontSize = 24;
Chart.defaults.global.tooltipFontStyle = "normal";
Chart.defaults.global.tooltipFontColor = "#fff";
Chart.defaults.global.tooltipTitleFontFamily = "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
Chart.defaults.global.tooltipTitleFontSize = 14;
Chart.defaults.global.tooltipTitleFontStyle = "bold";
Chart.defaults.global.tooltipTitleFontColor = "#fff";
Chart.defaults.global.tooltipYPadding = 6;
Chart.defaults.global.tooltipXPadding =  6;
Chart.defaults.global.tooltipCaretSize = 8;
Chart.defaults.global.tooltipCornerRadius =  6;
Chart.defaults.global.tooltipXOffset =10;

var pontifikat_gradient = pontifikat_chart.createLinearGradient(0, 0, 0, 300);
pontifikat_gradient.addColorStop(0, 'rgba(94, 78, 128, 0.5)');
pontifikat_gradient.addColorStop(1, 'rgba(94, 78, 128, 0)');

let mass_pontifikat_chart = new Chart(pontifikat_chart,
{
    type:'line',
    data:
    {
        labels:[],
        datasets:
        [{
            label:'posty na pontyfikat',
            data:[],
            pointRadius: 0.8,
            backgroundColor:pontifikat_gradient,
            borderWidth:5,
            borderColor:'#574185',
            hoverBorderWidth:3,
            hoverBorderColor:'#000'
        }]
    },
    options:
    {
        defaultFontFamily: Chart.defaults.global.defaultFontFamily = "'ubuntu'",
        responsive: true,
        showAllTooltips: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        tooltips:
        {
            titleFontSize: 20,
            bodyFontSize: 50,
            displayColors: false,
        },
        scales:
        {
            yAxes:
            [{
                ticks: {
                    fontSize: 20,
                    beginAtZero: true
                },
                gridLines:
                {
                    color: "rgba(255,255,255,0.05)"
                }
            }],
            xAxes:
            [{
                ticks:
                {
                    autoSkip: true,
                    maxTicksLimit: 30
                },
                gridLines:
                {
                    drawOnChartArea: false,
                    color: "rgba(255,255,255,0.1)"
                }
            }]
        },
        title:
        {
          display:false,
        },
        legend:
        {
          display:false,
        },
        layout:
        {
          padding:
          {
            left:0,
            right:0,
            bottom:0,
            top:0
          }
        },
        tooltips:
        {
          enabled:true
        }
    }
});

function update_pontifikat_chart()
{
    var time_select = document.getElementById("pontyfikat_time_select_select");
    var title = document.getElementById("pontyfikat_title");
    var time = parseInt(time_select.value);
    var idx = parseInt(time_select.selectedIndex);
    var title_text = time_select.options[idx].dataset.value;
    title.innerHTML = title_text;

    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            var json_data = JSON.parse(xmlHttp.responseText);
            var labels = [];
            var data = [];
            for( key in json_data)
            {
                var front = key.substr(key.length - 8)
                labels.push(front.slice(0, -3));
                data.push(json_data[key]);
            }
            mass_pontifikat_chart.data.datasets[0].data = data;
            mass_pontifikat_chart.data.labels = labels;
            mass_pontifikat_chart.update();
            setTimeout(function() { update_pontifikat_chart(); }, 300000);
        }
    }
    console.log(String(time))
    xmlHttp.open("GET", String('/rangepontyfikat/'+String(time)), true);
    xmlHttp.send(null);
}
setTimeout(function() { update_pontifikat_chart(); }, 50);