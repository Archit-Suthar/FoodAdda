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

