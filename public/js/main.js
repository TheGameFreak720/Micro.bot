$(document).ready(function() {

   $('.delete-article').on('click', function(e) {
     $target = $(e.target);
     const id = $target.attr('data-id');
     $.ajax({
         type: 'DELETE',
         url: '/article/' + id,
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
            url: '/video/' + id,
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
            url: '/post/' + id,
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




