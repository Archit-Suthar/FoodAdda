 var total = 0;

function clickHandler(elem){
  
   console.log(elem.parentNode.id);
   let parentId = elem.parentNode.id;
   // console.log($('parentId').children('.card-text.price').text());
  
   console.log( parseInt($(parentId).children('.price').text()));
}
