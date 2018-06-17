$(document).ready(function() {

   $('.delete-article').on('click', function(e) {
     $target = $(e.target);
     const id = $target.attr('data-id');
     $.ajax({
         type: 'DELETE',
         url: '/articles/' + id,
         success: function(response) {
             window.location.href='/articles';
         },
         error: function(err) {
             console.log(err);
         }
     });
   });

    $('.delete-video').on('click', function(e) {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/videos/' + id,
            success: function(response) {
                window.location.href='/videos';
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    $('.delete-post').on('click', function(e) {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/posts/' + id,
            success: function(response) {
                window.location.href='/posts';
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
});


function showPassword() {
    let x = document.getElementById("password");

    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function showPassword2() {
    let x = document.getElementById("password2");

    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function showPassword3() {
    let x = document.getElementById("password3");

    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}





