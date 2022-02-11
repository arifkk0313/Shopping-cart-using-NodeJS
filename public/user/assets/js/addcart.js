

function addToCart(proId) {
    $.ajax({
        url: '/add-to-cart/' + proId,
        method: 'get',
        success: (response) => {
            if (response.status) {
                let count = $('#cart-count').html()
                count = parseInt(count) + 1
                $("#cart-count").html(count)
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: false,
            
                  })
                  
                  Toast.fire({
                    icon: 'success',
                    title: 'successfully added to cart'
                  })
                
            } else {
                Swal.fire({
                    icon: "error",
                    title: "oops..",
                    text: "login to continue",
                    footer: "<a href='/login'>goto login page</a>"
                })
            }

        }
    })
}





   function gotocart(proid){
        $.ajax({
            url:'/go-to-cart-detail/'+proid,
            method:'get',
            success:(response)=>{
                if(response.status){
                    let count=$('#cart-count').html()
                    count=parseInt(count)
                    $("#cart-count").html(count)
                        location.href='/cart'
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "oops..",
                        text: "login to continue",
                        footer: "<a href='/login'>goto login page</a>"
                    })
                }
             
            }  
        })
    }
