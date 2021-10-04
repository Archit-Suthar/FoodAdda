 var total = 0;
 let str;
 function clickHandler(elem){
   // elem.preventDefault();
   // console.log(elem.parentNode.id);
   let parentId = elem.parentNode.id;
   // console.log(parentId);
   // console.log($('parentId').children('.card-text.price').text());
//   console.log($('#'+parentId).children('.price').text())
   let price =  parseInt($('#'+parentId).children('.price').text());
   total = total + price;
   console.log(total);
   document.getElementById('amount').innerHTML = total;
   str = $('#'+parentId).children('.card-title').text();
   // str=document.querySelector(".card-title").textContent;
   console.log(str);
   // document.getElementById('modal-body').innerHTML = $('#card-title'),$('#price')
   
}
$('#pauhe').children('.card-title').text()
