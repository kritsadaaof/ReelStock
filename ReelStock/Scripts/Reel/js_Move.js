$(document).ready(function () { 
    $("#Barcode").val('').focus();
    $("#Barcode").change(function (e) {
        $.post(baseUrl + "Reel/CheckBar", {
            BARCODE: $("#Barcode").val()
        }).done(function (data) {
            if (data == "F") {
                var nFrom = "top";
                var nAlign = "center";
                var nIcons = $(this).attr('data-icon');
                var nType = "warning";
                var nAnimIn = $(this).attr('data-animation-in');
                var nAnimOut = $(this).attr('data-animation-out');
                var mEss = "ไม่มีข้อมูล บาร์โค้ดนี้";
                notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, mEss);
                $("#Barcode").val('').focus();
            }
            else { $("#Location").focus(); }
        });
    });
    $("#Location").change(function (e) {
        $.post(baseUrl + "Reel/CheckLoc", {
            LOCATION: $("#Location").val()
        }).done(function (data) {
            if (data == "F") {
                var nFrom = "top";
                var nAlign = "center";
                var nIcons = $(this).attr('data-icon');
                var nType = "warning";
                var nAnimIn = $(this).attr('data-animation-in');
                var nAnimOut = $(this).attr('data-animation-out');
                var mEss = "ไม่มีข้อมูล Location นี้";
                notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, mEss);
                $("#Location").val('').focus();
            }
            else {
                $("#Location").val(data);
                $("#User").focus();
            }
        });
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
                $("#Save").focus();
            }
        });
    });

    $("#Save").click(function () { 
        $.post(baseUrl + "Reel/SaveMove", {
            BARCODE: $("#Barcode").val(),
            LOCATION: $("#Location").val(),
            USER: $("#User").val()
        }).done(function (data) {
            if (data == "S") {
                var nFrom = "top";
                var nAlign = "center";
                var nIcons = $(this).attr('data-icon');
                var nType = "success";
                var nAnimIn = $(this).attr('data-animation-in');
                var nAnimOut = $(this).attr('data-animation-out');
                var mEss = "บันทึกสำเร็จ";
                notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, mEss);
                setTimeout(
                    function () {
                        location.reload();
                    }, 4000);
            }
        });
    });

});

function dateFormat(a) {
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
function Show() {

    $(".Show").click(function () {
        $("#exampleModalLong").modal('show'); 
        // confirm(Session_ID + Loc); 
      //  alert($(this).data('state_size') + $(this).data('state_location'));
        //  Delete(Session_ID);
        $('#data-table-basic1').dataTable().fnClearTable();
        $.post(baseUrl + "Reel/GetDATAstockBysize", {
            SIZE: $(this).data('state_size'),
            LOCATION: $(this).data('state_location')
        }).done(function (data) {
            var pr = $.parseJSON(data);
            $.each(JSON.parse(data), function (i, obj) {

                $('#data-table-basic1').dataTable().fnAddData([
                    i + 1,
                    pr[i]["Reel_Code"],
                    pr[i]["Reel_Size"],
                    pr[i]["Reel_DateCreate"] 

                ]);
            }); 

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