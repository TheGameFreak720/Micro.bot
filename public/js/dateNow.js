$(document).ready(function() {
    var now = new Date();

    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var hour = now.getHours();
    var second = now.getMinutes();

    var today = now.getFullYear() + '-' + (month) + '-' + (day) + 'T' + (hour) + ':' + (second);

    $('#datePicker').val(today);
});