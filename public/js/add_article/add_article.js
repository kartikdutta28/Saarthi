$(document).ready(() => {
 
    // $('#btn').on('click', () => {
    //     let steps = $('#steps > textarea').val();
    //     // console.log(steps);
    // });

    $('.add').click(function() {
        $('.block:last').before(`<div class="block">
        <label class="control-label col-sm-2" for="steptitle">Step Title</label>
        <input type="text" class="form-control" name="steptitle" id="steptitle">
        <textarea class="form-control" name="step"  cols="5" rows="3"></textarea><span class="remove">Delete Step</span>
    </div>`);
    });
    $('.optionBox').on('click','.remove',function() {
         $(this).parent().remove();
    });

    $('#delete-article').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
          type:'DELETE',
          url: `/technicalUsers/technicalindex/${id}`,
          success: function(response){
            alert('Deleting Article');
            window.location.href='/technicalUsers/technicalindex';
          },
          error: function(err){
            console.log(err);
          }
        });
      });


    
});