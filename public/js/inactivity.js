$(document).ready(function() {

    //Auto logout after inactivity
    function inactivityLogout() {

        var logoutUrl = '/users/logout';

        var timeout = null;

        $(document).on('mousemove load click scroll keypress', function() {
            clearTimeout(timeout);

            timeout = setTimeout(function() {
                window.location = logoutUrl;
            }, 1800000); //30 minutes
        });
    }

    inactivityLogout()

});