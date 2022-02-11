function addTowishlist(event,proId){
  
    
    $.ajax({
        url:'/add-to-wishlist/'+proId,
        method:'get',
        success:(response)=>{
         
           if(response.user){
               if(response.status){
                  
                   
                   event.target.classList.remove("icon","text-danger")
                   const Toast = Swal.mixin({
                    toast: true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: false,
            
                  })
                  Toast.fire({
                    icon: 'success',
                    title: 'Item removed from wishlist'
                  })  
               }else{
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: false,
            
                  })
                  
                  Toast.fire({
                    icon: 'success',
                  
                    title: 'Item added to wishlist'
                  })
                   event.target.classList.add("icon","text-danger")
                }
           }else{
            
           Swal.fire({
               icon:"error",
               title:"oops..",
               text:"login to continue",
               footer:"<a href='/login'>goto login page</a>"
           })
           }
        }
    })
}


//adding elements to cart and adding the count on header
function addtocart(proid){
    $.ajax({
        url:'/add-to-cart/'+proid,
        method:'get',
        success:(response)=>{
            if(response.user){
            if(response.status){
                let count=$('#cart-count').html()
                count=parseInt(count)+1
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
            }
        }else{
            Swal.fire('Please login')
        }   
        }  
    })
}



