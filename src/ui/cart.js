(function($){
    let defaults = {
        cart: [],
        addItemClass : ".add-item",
        itemCountClass: ".item-count",
        totalItemClass : ".total-item",
        totalCostClass : ".total-cost",
        deleteAllClass : ".reset"
    }

    function Item(name, cost, img, count) {
        this.name = name;
        this.cost = cost;
        this.img = img;
        this.count = count;
    }

    function cartComponent(domEle,options){
        this.options = $.extend(true,{},defaults,options)
        this.cart = [];
        this.cart_ele = $(domEle);
        this.init();
    }

    $.extend(cartComponent.prototype, {
        init: function(){
            this._setupCart();
            this._setEvents();
            this._loadCart();
            this._updateCart();
        },
        _setupCart: function(){
            this.cart_ele.addClass("cart");
            this.cart_ele.append("<div class='cart-buttons'>\n\
                                    <button href='#' class='button-item' onclick='closeNav()'><span class='material-icons'>close</span></button>\n\
                                    <button href='#' class='button-item reset'><span class='material-icons'>delete</span></button>\n\
                                </div>\n\
                                <h1 class='cart-heading'>My <span class='color-primary'>Order</span></h1>\n\
                                <div class='cart-items'>\n\
                                    <table class='cart-table item-count'>\n\
                                    </table>\n\
                                </div>\n\
                                <div class='cart-total'>\n\
                                    <p>Total:</p>\n\
                                    <p class='total-num total-cost'>0</p>\n\
                                </div>\n\
                                <hr>\n\
                                <button class='button cart-button'>Checkout</button>");
        },
        _setEvents: function(){
            let itm = this;
            $(this.options.addItemClass).on("click", function(e){
                e.preventDefault();
                let name = $(this).attr("data-name");
                let cost = Number($(this).attr("data-price"));
                let img  = $(this).attr("data-img");
                itm._addItemCart(name,cost,img,1);
                itm._updateCart();
            });

            $(this.options.deleteAllClass).on("click", function(e){
                e.preventDefault();
                itm._deleteAll();
                itm._updateCart();
            });

        },
        _updateCart: function(){
            let itm = this;
            $(this.options.itemCountClass).html(itm._showCart());
            $(this.options.totalItemClass).html(itm._totalItemCount());
            $(this.options.totalCostClass).html(itm._totalCost());
        },
        _addItemCart: function(name,cost,img,count){
            // console.log(this.cart);
            for(let i in this.cart){
                if(this.cart[i].name === name){
                    this.cart[i].count++;
                    this.cart[i].cost = cost * this.cart[i].count;
                    this._saveCart();
                    console.log("success");
                    return;
                }
            }
                let item = new Item(name,cost,img,count);
                console.log("success");
                this.cart.push(item);
                this._saveCart();

        },
        _showCart: function(){
            let cartArray = this._listCart();
            console.log(cartArray);
            let output = "";
            if(cartArray.length<=0){
                output = "There is Nothing Yet!";
            }
            for(let i in cartArray){
                output += "<tr class='cart-item'>\n\
                                            <td>\n\
                                                <img src='"+cartArray[i].img+"' alt='picture of a clothes' class='item-image'>\n\
                                            </td>\n\
                                            <td>\n\
                                                <p>"+cartArray[i].name+"</p>\n\
                                            </td>\n\
                                            <td>\n\
                                                <label for='cart-quantity'><span class='material-icons'>close</span></label>\n\
                                                <input id='cart-quantity' data-name='" + cartArray[i].name + "' data-price='" + cartArray[i].cost + " 'value='" + cartArray[i].count + "' type='number' value='1' min='0' step='1'>\n\
                                            </td>\n\
                                            <td>\n\
                                                <p>"+cartArray[i].cost+" K</p>\n\
                                            </td>\n\
                                        </tr>";
            }
            return output;
        },
        _listCart: function(){
            let cartCopy = [];
            for(let i in this.cart){
                let item = this.cart[i];
                let itemCopy = {};
                for(let p in item){
                    itemCopy[p] = item[p];
                }
                cartCopy.push(itemCopy);
            }
            return cartCopy;
        },
        _totalItemCount: function(){
            let count = 0
            for(let i in this.cart){
                count += this.cart[i].count;
            }
            return count;
        },
        _totalCost: function(){
            let total = 0;
            for(let i in this.cart){
                total += this.cart[i].cost;
            }
            return total + " K";
        },
        _deleteAll: function(){
            this.cart = [];
            this._saveCart();
        },
        _saveCart: function(){
            localStorage.setItem("myCart", JSON.stringify(this.cart));
        },
        _loadCart: function(){  
            this.cart = JSON.parse(localStorage.getItem("myCart"));
            if (this.cart === null) {
                this.cart = [];
            }
        },
    });

    $.fn.cartComponent = function(){
        return this.each(function(){
            $.data(this, "cartComponent", new cartComponent(this));
            console.log($(this, "cartComponent"));
        });
    };
})(jQuery, window, document);