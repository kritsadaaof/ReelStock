$(document).ready(function () {
    // alert("OK");
    $("#Cal").click(function () {
        if ($("#QTY_Reel").val() == "" && $("#User").val() == "") {
            $("#User").focus();
        }
        $('#tab_logic tbody').remove();
        var a = $("#QTY_Reel").val();
        var i = 1;
        for (i; i <= a; i++) {

            $('#tab_logic').append('<tr  class="FontSize" id="addr' + (i) + '"><td>' + (i) + '</td><td>' + $("#Reel_Size").val() + '</td>' +
                '<td> <img src="../Reel/RenderBarcode?id=aaa)" width="80" height="20" /></td>' +
                '<td ><a class="ReelClick" id="' + (i) + '" title="' + $("#Reel_Size").val() + '"   style="color:darkblue" target="_blank" href="../Reel/PrintViewToPdf?id=' + $("#Reel_Size").val() +'" >คลิ๊ก</a></td></tr>');
        }
        ReelClick();
    });
    $("#clear").click(function () {
        location.reload();
    });
    $("#User").change(function (e) {
        $.post(baseUrl + "Reel/CheckUser", {
            USER: $("#User").val()
        }).done(function (data) {
            var pr = $.parseJSON(data);
            if (data == "[]") {
                var nFrom = "top";
                var nAlign = "center";
                var nIcons = $(this).attr('data-icon');
                var nType = "warning";
                var nAnimIn = $(this).attr('data-animation-in');
                var nAnimOut = $(this).attr('data-animation-out');
                var mEss = "ไม่มีข้อมูล User นี้";
                notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, mEss);
                $("#User").val("").focus();
            } else {
                $("#User").val(pr[0]["Mem_Name"]);
            }
        });
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

function ReelClick() {
    $(".ReelClick").click(function () {
      //  alert(this.id);
      //  window.open = baseUrl + "../Reel/PrintViewToPdf?id=" + this.title;
        var row = document.getElementById("addr" + this.id);
        row.parentNode.removeChild(row);
        $.post(baseUrl + "Reel/SaveReel", {
            id: this.title,
            USER: $("#User").val()
        }).done(function (data) {
           
        });
    });
}

function notify(from, align, icon, type, animIn, animOut, mEssage) { //Notify
    $.growl({
        icon: icon,
        title: ' แจ้งเตือน ',
        message: mEssage,

        url: ''
    }, {
        element: 'body',
        type: type,
        allow_dismiss: true,
        placement: {
            from: from,
            align: align
        },
        offset: {
            x: 20,
            y: 85
        },
        spacing: 10,
        z_index: 1031,
        delay: 2500,
        timer: 2000,
        url_target: '_blank',
        mouse_over: false,
        animate: {
            enter: animIn,
            exit: animOut
        },
        icon_type: 'class',
        template: '<div data-growl="container" class="alert" role="alert">' +
            '<button type="button" class="close" data-growl="dismiss">' +
            '<span aria-hidden="true">&times;</span>' +
            '<span class="sr-only">Close</span>' +
            '</button>' +
            '<span data-growl="icon"></span>' +
            '<span data-growl="title"></span>' +
            '<span data-growl="message"></span>' +
            '<a href="#" data-growl="url"></a>' +
            '</div>'
    });
};