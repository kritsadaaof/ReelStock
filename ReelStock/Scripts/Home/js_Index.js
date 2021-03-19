$(document).ready(function () { 
    $("#Regis").click(function () {
        window.location = baseUrl + "Reel/Index";     
    });
    $("#Stock").click(function () {
        window.location = baseUrl + "Reel/Stock";
    });
    $("#Move").click(function () {
        window.location = baseUrl + "Reel/Move";
    });
});
function dateFormat() {
    var d = new Date();
    month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    var val = day + "/" + month + "/" + year;
    return val;
}