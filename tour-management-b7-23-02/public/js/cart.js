// Vẽ tour ra giao diện
const drawListTour = () => {
  fetch("/cart/list-json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: localStorage.getItem("cart")
  })
    .then(res => res.json())
    .then(data => {
      const tours = data.tours;
      
      const htmls = tours.map((item, index) => {
        return `
        <tr>
          <td>${index + 1}</td>
          <td><img src="${item.image}" alt="${item.info.title}" width="80px" /></td>
          <td><a href="/tours/detail/${item.info.slug}">${item.info.title}</a></td>
          <td>${item.price_special.toLocaleString()}đ</td>
          <td>
            <input
              type="number" 
              name="quantity" 
              value="${item.quantity}" 
              min="1" 
              item-id="${item.tourId}" 
              style="width: 60px;" 
            />
          </td>
          <td>${item.total.toLocaleString()}đ</td>
          <td><button class="btn btn-sm btn-danger" btn-delete="${item.tourId}">Xóa</button></td>
      </tr>
        `;
      });
  
      const listTour = document.querySelector("[list-tour]");
      listTour.innerHTML = htmls.join("");
  
  
      // Tính tổng tiền đơn hàng
      const totalPrice = tours.reduce((sum, item) => sum + item.total, 0);
      const elementTotalPrice = document.querySelector("[total-price]");
      elementTotalPrice.innerHTML = totalPrice.toLocaleString();
  
  
      deleteItemInCart();

      updateQuantityInCart();
    })
}
// Hết Vẽ tour ra giao diện

// Xóa sản phẩm trong giỏ hàng
const deleteItemInCart = () => {
  const listBtnDelete = document.querySelectorAll("[btn-delete]");
  listBtnDelete.forEach(button => {
    button.addEventListener("click", () => {
      const tourId = button.getAttribute("btn-delete");
      const cart = JSON.parse(localStorage.getItem("cart"));
      const newCart = cart.filter(item => item.tourId != tourId);
      localStorage.setItem("cart", JSON.stringify(newCart));

      drawListTour();
    });
  });
}
// Hết Xóa sản phẩm trong giỏ hàng

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateQuantityInCart = () => {
  const listInput = document.querySelectorAll("[list-tour] input[name='quantity']");
  listInput.forEach(input => {
    input.addEventListener("change", () => {
      const tourId = input.getAttribute("item-id");
      const quantity = parseInt(input.value);

      const cart = JSON.parse(localStorage.getItem("cart"));
      const tourUpdate = cart.find(item => item.tourId == tourId);
      tourUpdate.quantity = quantity;

      localStorage.setItem("cart", JSON.stringify(cart));

      drawListTour();
    });
  });
}
// Hết Cập nhật số lượng sản phẩm trong giỏ hàng

// Lấy data và in ra giao diện
drawListTour();
// Hết Lấy data và in ra giao diện

// Đặt hàng
const formOrder = document.querySelector("[form-order]");
if(formOrder) {
  formOrder.addEventListener("submit", (event) => {
    event.preventDefault();

    const cart = JSON.parse(localStorage.getItem("cart"));

    const fullName = event.target.elements.fullName.value;
    const phone = event.target.elements.phone.value;
    const note = event.target.elements.note.value;

    const data = {
      info: {
        fullName: fullName,
        phone: phone,
        note: note
      },
      cart: cart
    };

    fetch("/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        if(data.code === 200) {
          localStorage.removeItem("cart");
          window.location.href = `/order/success?orderCode=${data.orderCode}`;
        } else {
          alert("Đặt hàng không thành công!");
        }
      })
  });
}
// Hết Đặt hàng