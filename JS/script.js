 var total = 0;
 let orderList = ""
 function clickHandler(elem){
    let str;
  
   let parentId = elem.parentNode.id;
   
   let price =  parseInt($('#'+parentId).children('.price').text());
   total = total + price;
   str = $('#'+parentId).children('.card-title').text();
   orderList = orderList.concat(str)+':' + price +'\n';
   console.log(orderList);
   console.log('total amount:'+total);
   document.getElementById('amount').innerHTML = orderList + "\n" + "<b>Total Amount:</b>" + total; 
}

let removeCartItemButtons = document.getElementsByClassName('btn-danger')
// console.log(removeCartItemButtons)
for(var i = 0;i<removeCartItemButtons.length;i++){
   var button = removeCartItemButtons[i];
   button.addEventListener('click',function (event){
     var buttonClicked =  event.target
     buttonClicked.parentElement.parentElement.remove();
     updateCartTotal()
   })
}

function updateCartTotal(){
   let cartItemContainer = document.getElementsByClassName('cart-item')[0]
   let cartRows = cartItemContainer.getElementsByClassName('cart-row')
   for(var i = 0;i<cartRows.length;i++){
      let cartRow = cartRows[i]
      let priceElement = cartRow.getElementsByClassName('cart-price')[0]
      let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
      console.log(priceElement,quantityElement);
   }

}
 
$(document).ready(function(){
    $("#testimonial-slider").owlCarousel({
        items:3,
        itemsDesktop:[1000,3],
        itemsDesktopSmall:[979,2],
        itemsTablet:[768,2],
        itemsMobile:[650,1],
        pagination:true,
        autoPlay:true
    });
});