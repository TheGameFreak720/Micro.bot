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




