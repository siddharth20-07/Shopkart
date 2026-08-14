const products=[
{id:1,name:"Wireless Headphones",price:1499,old:1999,cat:"electronics",emoji:"🎧"},
{id:2,name:"Smart Watch",price:2299,old:2999,cat:"electronics",emoji:"⌚"},
{id:3,name:"Running Shoes",price:1799,old:2499,cat:"fashion",emoji:"👟"},
{id:4,name:"Classic Backpack",price:999,old:1399,cat:"fashion",emoji:"🎒"},
{id:5,name:"Coffee Maker",price:1899,old:2499,cat:"home",emoji:"☕"},
{id:6,name:"Table Lamp",price:799,old:1099,cat:"home",emoji:"💡"},
{id:7,name:"Skincare Set",price:1299,old:1699,cat:"beauty",emoji:"🧴"},
{id:8,name:"Sunglasses",price:699,old:999,cat:"fashion",emoji:"🕶️"}
];
let cart=JSON.parse(localStorage.getItem("shopkart_cart")||"[]"), currentCat="all", search="";

const productsEl=document.getElementById("products"), cartItems=document.getElementById("cartItems");
const cartCount=document.getElementById("cartCount"), cartTotal=document.getElementById("cartTotal");
const toast=document.getElementById("toast");

function money(n){return "₹"+n.toLocaleString("en-IN")}
function renderProducts(){
 let list=products.filter(p=>(currentCat==="all"||p.cat===currentCat)&&p.name.toLowerCase().includes(search.toLowerCase()));
 const sort=document.getElementById("sortSelect").value;
 if(sort==="low")list.sort((a,b)=>a.price-b.price); if(sort==="high")list.sort((a,b)=>b.price-a.price);
 document.getElementById("resultText").textContent=`${list.length} product${list.length!==1?"s":""} found`;
 productsEl.innerHTML=list.length?list.map(p=>`<article class="product">
 <div class="product-img">${p.emoji}</div><div class="info"><span class="badge">In Stock</span>
 <h3>${p.name}</h3><div class="stars">★★★★★</div><div class="price">${money(p.price)} <span class="old">${money(p.old)}</span></div>
 <button class="add" onclick="addToCart(${p.id})">Add to Cart</button></div></article>`).join(""):"<p>No products found.</p>";
}
function addToCart(id){const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});save();showToast("Added to cart");}
function save(){localStorage.setItem("shopkart_cart",JSON.stringify(cart));renderCart();}
function renderCart(){
 let total=0,count=0;
 cartItems.innerHTML=cart.length?cart.map(item=>{const p=products.find(x=>x.id===item.id);total+=p.price*item.qty;count+=item.qty;return `<div class="cart-item">
 <div class="pic">${p.emoji}</div><div><h4>${p.name}</h4><b>${money(p.price)}</b><div class="qty">
 <button onclick="changeQty(${p.id},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${p.id},1)">+</button>
 </div></div><button class="remove" onclick="removeItem(${p.id})">Remove</button></div>`}).join(""):"<p class='muted'>Your cart is empty.</p>";
 cartCount.textContent=count;cartTotal.textContent=money(total);
}
function changeQty(id,d){const x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);save();}
function removeItem(id){cart=cart.filter(i=>i.id!==id);save();}
function showToast(t){toast.textContent=t;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1600)}
document.querySelectorAll(".category").forEach(b=>b.onclick=()=>{document.querySelectorAll(".category").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentCat=b.dataset.category;renderProducts()});
document.getElementById("searchBtn").onclick=()=>{search=document.getElementById("searchInput").value;renderProducts()};
document.getElementById("searchInput").addEventListener("input",e=>{search=e.target.value;renderProducts()});
document.getElementById("sortSelect").onchange=renderProducts;

const panel=document.getElementById("cartPanel"),overlay=document.getElementById("overlay");
function openCart(){panel.classList.add("open");overlay.classList.add("open")}function closeCart(){panel.classList.remove("open");overlay.classList.remove("open")}
document.getElementById("cartBtn").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;overlay.onclick=closeCart;

const modal=document.getElementById("checkoutModal");
document.getElementById("checkoutBtn").onclick=()=>{if(!cart.length)return showToast("Cart is empty");modal.classList.add("show")};
document.getElementById("closeModal").onclick=()=>modal.classList.remove("show");
document.getElementById("checkoutForm").onsubmit=e=>{e.preventDefault();cart=[];save();modal.classList.remove("show");closeCart();showToast("Order placed successfully!");e.target.reset()};
renderProducts();renderCart();