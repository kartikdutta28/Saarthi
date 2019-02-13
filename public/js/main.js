$(document).ready(() => {
 
    $('#btn').on('click', () => {
    let steps = $('#steps > textarea').val();
    console.log(steps);
    });

    $('.add').click(function() {
        $('.block:last').before(`<div class="block">
        <textarea class="form-control" name="step"  cols="30" rows="10"></textarea><span class="remove">Delete Step</span>
    </div>`);
    });
    $('.optionBox').on('click','.remove',function() {
         $(this).parent().remove();
    });
    
});

var updatePostStats = {
    Like: function (postId) {
        document.querySelector('#likes-count-' + postId).textContent++;
    },
    Unlike: function(postId) {
        document.querySelector('#likes-count-' + postId).textContent--;
    }
};

var toggleButtonText = {
    Like: function(button) {
        button.textContent = "Unlike";
    },
    Unlike: function(button) {
        button.textContent = "Like";
    }
};

var actOnPost = function (event) {
    var postId = event.target.dataset.postId;
    var action = event.target.textContent.trim();
    toggleButtonText[action](event.target);
    updatePostStats[action](postId);
    axios.post('/posts/' + postId + '/act', { action: action });
};
var pusher = new Pusher('1c85b3a5edd16467f014', {
    cluster: 'ap2'
});
var socketId;

// retrieve the socket ID on successful connection
pusher.connection.bind('connected', function() {
    socketId = pusher.connection.socket_id;
});


var channel = pusher.subscribe('post-events');
channel.bind('postAction', function(data) {
    // log message data to console - for debugging purposes
    console.log(data);
    var action = data.action;
    updatePostStats[action](data.postId);
});