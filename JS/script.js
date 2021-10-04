 var total = 0;

function clickHandler(elem){
  
   // console.log(elem.parentNode.id);
   let parentId = elem.parentNode.id;
   // console.log($('parentId').children('.card-text.price').text());
//   console.log($('#'+parentId).children('.price').text())
   let price =  parseInt($('#'+parentId).children('.price').text());
   total = total + price;
   console.log(total);
   document.getElementById('amount').innerHTML = total;
  
}
