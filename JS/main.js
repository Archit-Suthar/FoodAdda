(function(){
  // Add to Cart Interaction - by CodyHouse.co
  var cart = document.getElementsByClassName('js-cd-cart');
  if(cart.length > 0) {
  	var cartAddBtns = document.getElementsByClassName('js-cd-add-to-cart'),
  		cartBody = cart[0].getElementsByClassName('cd-cart__body')[0],
  		cartList = cartBody.getElementsByTagName('ul')[0],
  		cartListItems = cartList.getElementsByClassName('cd-cart__product'),
  		cartTotal = cart[0].getElementsByClassName('cd-cart__checkout')[0].getElementsByTagName('span')[0],
  		cartCount = cart[0].getElementsByClassName('cd-cart__count')[0],
  		cartCountItems = cartCount.getElementsByTagName('li'),
  		cartUndo = cart[0].getElementsByClassName('cd-cart__undo')[0],
  		productId = 0, //this is a placeholder -> use your real product ids instead
  		cartTimeoutId = false,
  		animatingQuantity = false;
		initCartEvents();


		function initCartEvents() {
			// add products to cart
			for(var i = 0; i < cartAddBtns.length; i++) {(function(i){
				cartAddBtns[i].addEventListener('click', addToCart);
			})(i);}

			// open/close cart
			cart[0].getElementsByClassName('cd-cart__trigger')[0].addEventListener('click', function(event){
				event.preventDefault();
				toggleCart();
			});
			
			cart[0].addEventListener('click', function(event) {
				if(event.target == cart[0]) { // close cart when clicking on bg layer
					toggleCart(true);
				} else if (event.target.closest('.cd-cart__delete-item')) { // remove product from cart
					event.preventDefault();
					removeProduct(event.target.closest('.cd-cart__product'));
				}
			});

			// update product quantity inside cart
			cart[0].addEventListener('change', function(event) {
				if(event.target.tagName.toLowerCase() == 'select') quickUpdateCart();
			});

			//reinsert product deleted from the cart
			cartUndo.addEventListener('click', function(event) {
				if(event.target.tagName.toLowerCase() == 'a') {
					event.preventDefault();
					if(cartTimeoutId) clearInterval(cartTimeoutId);
					// reinsert deleted product
					var deletedProduct = cartList.getElementsByClassName('cd-cart__product--deleted')[0];
					Util.addClass(deletedProduct, 'cd-cart__product--undo');
					deletedProduct.addEventListener('animationend', function cb(){
						deletedProduct.removeEventListener('animationend', cb);
						Util.removeClass(deletedProduct, 'cd-cart__product--deleted cd-cart__product--undo');
						deletedProduct.removeAttribute('style');
						quickUpdateCart();
					});
					Util.removeClass(cartUndo, 'cd-cart__undo--visible');
				}
			});
		};

		function addToCart(event) {
			var button = event.target
			var shopItem = button.parentElement.parentElement
			
			var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
			
			var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
			
			var ImageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
			
			event.preventDefault();
			if(animatingQuantity) return;
			var cartIsEmpty = Util.hasClass(cart[0], 'cd-cart--empty');
			//update cart product list
			productId = productId + 1;
			var productAdded = 
			`<li class="cd-cart__product">
				<div class="cd-cart__image">
					<img src=${ImageSrc} alt="placeholder">
				</div>
				<div class="cd-cart__details">
					<h3 class="truncate">${title}</h3>
					<span class="cd-cart__price">${price}</span>
					<div class="cd-cart__actions">
						<a href="#0" class="cd-cart__delete-item">Delete</a>
							<div class="cd-cart__quantity">
								<label for="cd-product-'+ productId +'">Qty</label>
								<span class="cd-cart__select">
									<select class="reset" id="cd-product-'+ productId +'" name="quantity">
										<option value="1">1</option>
										<option value="2">2</option>
										<option value="3">3</option>
										<option value="4">4</option>
										<option value="5">5</option>
										<option value="6">6</option>
										<option value="7">7</option>
										<option value="8">8</option>
										<option value="9">9</option>
									</select><svg class="icon" viewBox="0 0 12 12"><polyline fill="none" stroke="currentColor" points="2,4 6,8 10,4 "/></svg>
								</span>
							</div>
					</div></div></li>`;
			cartList.insertAdjacentHTML('beforeend', productAdded);
			// var modal = document.getElementById('orderModalBody');
			// modal = productAdded;
			// addProduct(this);
			//update number of items 
			updateCartCount(cartIsEmpty);
			//update total price
			updateCartTotal(this.getAttribute('data-price'), true);
			//show cart
			Util.removeClass(cart[0], 'cd-cart--empty');
		};
		
		function toggleCart(bool) { // toggle cart visibility
			var cartIsOpen = ( typeof bool === 'undefined' ) ? Util.hasClass(cart[0], 'cd-cart--open') : bool;
		
			if( cartIsOpen ) {
				Util.removeClass(cart[0], 'cd-cart--open');
				//reset undo
				if(cartTimeoutId) clearInterval(cartTimeoutId);
				Util.removeClass(cartUndo, 'cd-cart__undo--visible');
				removePreviousProduct(); // if a product was deleted, remove it definitively from the cart

				setTimeout(function(){
					cartBody.scrollTop = 0;
					//check if cart empty to hide it
					if( Number(cartCountItems[0].innerText) == 0) Util.addClass(cart[0], 'cd-cart--empty');
				}, 500);
			} else {
				Util.addClass(cart[0], 'cd-cart--open');
			}
		};

		

		function removeProduct(product) {
			if(cartTimeoutId) clearInterval(cartTimeoutId);
			removePreviousProduct(); // prduct previously deleted -> definitively remove it from the cart
			
			var topPosition = product.offsetTop,
				productQuantity = Number(product.getElementsByTagName('select')[0].value),
				productTotPrice = Number((product.getElementsByClassName('cd-cart__price')[0].innerText).replace('$', '')) * productQuantity;

			product.style.top = topPosition+'px';
			Util.addClass(product, 'cd-cart__product--deleted');

			//update items count + total price
			updateCartTotal(productTotPrice, false);
			updateCartCount(true, -productQuantity);
			Util.addClass(cartUndo, 'cd-cart__undo--visible');

			//wait 8sec before completely remove the item
			cartTimeoutId = setTimeout(function(){
				Util.removeClass(cartUndo, 'cd-cart__undo--visible');
				removePreviousProduct();
			}, 8000);
		};

		function removePreviousProduct() { // definitively removed a product from the cart (undo not possible anymore)
			var deletedProduct = cartList.getElementsByClassName('cd-cart__product--deleted');
			if(deletedProduct.length > 0 ) deletedProduct[0].remove();
		};

		function updateCartCount(emptyCart, quantity) {
			if( typeof quantity === 'undefined' ) {
				var actual = Number(cartCountItems[0].innerText) + 1;
				var next = actual + 1;
				
				if( emptyCart ) {
					cartCountItems[0].innerText = actual;
					cartCountItems[1].innerText = next;
					animatingQuantity = false;
				} else {
					Util.addClass(cartCount, 'cd-cart__count--update');

					setTimeout(function() {
						cartCountItems[0].innerText = actual;
					}, 150);

					setTimeout(function() {
						Util.removeClass(cartCount, 'cd-cart__count--update');
					}, 200);

					setTimeout(function() {
						cartCountItems[1].innerText = next;
						animatingQuantity = false;
					}, 230);
				}
			} else {
				var actual = Number(cartCountItems[0].innerText) + quantity;
				var next = actual + 1;
				
				cartCountItems[0].innerText = actual;
				cartCountItems[1].innerText = next;
				animatingQuantity = false;
			}
		};

		function updateCartTotal(price, bool) {
			cartTotal.innerText = bool ? (Number(cartTotal.innerText) + Number(price)).toFixed(2) : (Number(cartTotal.innerText) - Number(price)).toFixed(2);
		};

		function quickUpdateCart() {
			var quantity = 0;
			var price = 0;

			for(var i = 0; i < cartListItems.length; i++) {
				if( !Util.hasClass(cartListItems[i], 'cd-cart__product--deleted') ) {
					var singleQuantity = Number(cartListItems[i].getElementsByTagName('select')[0].value);
					quantity = quantity + singleQuantity;
					price = price + singleQuantity*Number((cartListItems[i].getElementsByClassName('cd-cart__price')[0].innerText).replace('$', ''));
				}
			}

			cartTotal.innerText = price.toFixed(2);
			cartCountItems[0].innerText = quantity;
			cartCountItems[1].innerText = quantity+1;
		};
  }
  var orderConfirmed = document.getElementsByClassName('cd-cart__checkout')[0];
  
  orderConfirmed.addEventListener('click',function(){
	  //  var orderConfirm = document.getElementsByClassName('orderConfirm')[0].innerHTML;
	  // console.log(actionBtn);
	  var actionBtn = document.getElementsByClassName('cd-cart__actions');
	  for(let i=0;i<actionBtn.length;i++){
			actionBtn[i].style.display = "none";
	  }
	// actionBtn.remove();
	var orderConfirm = document.getElementsByClassName('cd-cart__body')[0].innerHTML;
	var total = document.getElementsByClassName('cd-cart__footer')[0];
	var totalAmount = total.getElementsByTagName('span')[0].innerText;
	 var orderModalBody = document.getElementById('orderModalBody');
	// orderModalBody.innerHTML = orderConfirm.children;
	
	orderModalBody.innerHTML = orderConfirm + `<b style="float: right;">Total Amount: ₹${totalAmount}</b>`;
	
  })
  var closeBtn = document.getElementById('actionEnable');
  closeBtn.addEventListener('click',
  function actionEnable(){
	var actionBtn = document.getElementsByClassName('cd-cart__actions');
	  for(let i=0;i<actionBtn.length;i++){
			actionBtn[i].style.display = "flex";
	  }
	
  });
  var apply = document.getElementById('promo');
  apply.addEventListener('click',
  function promoCodeChecker(){
	var total = document.getElementsByClassName('cd-cart__footer')[0];
	var totalAmount = total.getElementsByTagName('span')[0].innerText;
	var orderConfirm = document.getElementsByClassName('cd-cart__body')[0].innerHTML;
	 var code =  document.getElementById("promoCode").value
	if(code == 'GET75OFF' && totalAmount>299){
		orderModalBody.innerHTML = orderConfirm + `<b style="color:green;"> *Promocode Applied Successfully</b><b style="float: right;">Total Amount: ₹${totalAmount-75}</b>`;
	}else if(code != 'GET75OFF' || totalAmount<299 ){
		orderModalBody.innerHTML = orderConfirm + `<p style="float: right;"><b>Total Amount: ₹${totalAmount}</b></p><p style="color:red"><b> *Promocode not Applicable</b></p>`;
	}
  } )

//   var confirmed = document.getElementById('comfirmed');
//   confirmed.addEventListener('click',function finalOrderPlaced(){
// 	console.log("Ok!!")
//   })
function sendEmail(){
	var total = document.getElementsByClassName('cd-cart__footer')[0];
	var totalAmount = total.getElementsByTagName('span')[0].innerText;
	var orderConfirm = document.getElementsByClassName('cd-cart__body')[0].innerHTML;
	Email.send({
Host : "smtp.gmail.com",
Username : "foodaddarestaurant@gmail.com",
Password : "food@bwpAdda",
To : 'kevalm221@gmail.com',
From : "foodaddarestaurant@gmail.com",
Subject : "This is the subject",
Body : orderConfirm + `<p style="float: right;"><b>Total Amount: ₹${totalAmount}</b></p><p style="color:red"><b> *Promocode not Applicable</b></p>`
}).then(
	console.log("send")
);
}
var confirmed = document.getElementById('comfirmed')
confirmed.addEventListener('click',sendEmail)

})();

