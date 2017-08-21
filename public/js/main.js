$(document).ready(function(){
    $('.deleteUser').on('click', deleteUser);
});

function deleteUser(){
    //alert(1);
    var conformation = confirm('Are you sure');
    if(conformation){
        //alert('confirmation');
        $.ajax({
            type: 'DELETE',
            url: '/users/delete/'+$(this).data('id')
        }).done(function(response){
            window.location.replace('/');
        });
        window.location.replace('/');
    }else{
        return false;
    }
}