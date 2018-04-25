$(document).ready(function() {

   $('.delete-article').on('click', function(e) {
     $target = $(e.target);
     const id = $target.attr('data-id');
     $.ajax({
         type: 'DELETE',
         url: '/articles/' + id,
         success: function(response) {
             alert('Deleting Article');
             window.location.href='/';
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
                alert('Deleting Video');
                window.location.href='/';
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
                alert('Deleting Post');
                window.location.href='/';
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
});




