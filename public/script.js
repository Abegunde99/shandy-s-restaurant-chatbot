const chatContainer = document.getElementById("chatContainer");
const submitBtn = document.getElementById("submitBtn1");
const submitBtn2 = document.getElementById("submitBtn2");
const inputText = document.getElementById("exampleFormControlInput1");
const app = document.getElementById('container')
const socket = io();

inputText.setAttribute("placeholder", "Enter your command");

socket.on("welcomeMessage", function (message) {
  createChat2(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

socket.on("commands", function ({ message, time }) {
  createChat3(message, time);
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

//listen to change submit button
socket.on("changeSubmitBtn", function (message) {
  submitBtn.classList.add("d-none");
  submitBtn2.classList.remove("d-none");

  inputText.setAttribute("placeholder", "Enter your order");
});

//listen to change submit button2
socket.on("changeSubmitBtn2", function (message) {
  submitBtn.classList.remove("d-none");
  submitBtn2.classList.add("d-none");

  inputText.setAttribute("placeholder", "Enter your command");
});
//listen for chatMessage
socket.on("chatMessage", function (message) {
  createChat(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

//listen for menu
socket.on("menu", function (message) {
  console.log(message);
  createChat4(message.message, message.time);
  chatContainer.scrollTop = chatContainer.scrollHeight;
});


//listen for orderCheckedOut
socket.on("orderCheckedOut", function (message) {
  createChat2(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

//listen for orderNotInMenu
socket.on("orderNotInMenu", function (message) {
  createChat2(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

//listen for orderPicked
socket.on("orderPicked", function (message) {
  createChat5(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

//listen for multiple orders
socket.on("multipleOrdersPicked", function (message) {
  createChat6(message.message, message.time);
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

//listen for order
socket.on("orders", function (message) {

 console.log(message);

  //get the total amount of the order
  let total = 0;
  for (let i = 0; i < message.length; i++) {
    total += message[i].price;
  }
  console.log(total);

  createChat7(message, total);
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

//listen for all orders
socket.on("allOrders", function (message) {
  console.log(message);
  createChat8(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const message = inputText.value;

  //emit message to server
  if (message != "") {
    socket.emit("chatMessage", message);
    inputText.value = "";
  }
});

submitBtn2.addEventListener("click", function (e) {
  e.preventDefault();
  const message = inputText.value;

  //emit message to server
  if (message != "") {
    socket.emit("chatMessage2", message);
    inputText.value = "";
  }
});

function createChat(message) {
  const div = document.createElement("div");
  div.setAttribute("class", "d-flex flex-row justify-content-end");
  div.innerHTML = `<div>
   
    <p class="small p-2 ms-3 mb-1 rounded-3 font-weight-bold" style="background-color: #f5f6f7;">${message.message}</p>
    <p class="small ms-3 mb-3 rounded-3 text-muted d-flex justify-content-end font-italic">${message.time}</p>
  </div>
  <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
    alt="avatar 1" style="width: 45px; height: 100%;">`;
  chatContainer.appendChild(div);
}

function createChat2(message) {
  const div = document.createElement("div");
  div.setAttribute("class", "d-flex flex-row justify-content-start");
  div.innerHTML = `<img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
    alt="avatar 1" style="width: 45px; height: 100%;">
    <div>
    <p class="small p-2 ms-3 mb-1 rounded-3 font-weight-bold" style="background-color: #f5f6f7;">${message.message}</p>
    <p class="small ms-3 mb-3 rounded-3 text-muted d-flex justify-content-end font-italic">${message.time}</p>
  </div>`;
  chatContainer.appendChild(div);
}

function createChat5(message) {
  const msg = message.message;
  const div = document.createElement("div");
  div.setAttribute("class", "d-flex flex-row justify-content-start");
  div.innerHTML = `<img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
    alt="avatar 1" style="width: 45px; height: 100%;">
    <div>
    <p class="small p-2 ms-3 mb-1 rounded-3 font-weight-bold" style="background-color: #f5f6f7;">${msg.name}  -  #${msg.price}  ordered</p>
      
    <p class="small ms-3 mb-3 rounded-3 text-muted d-flex justify-content-end font-italic">${message.time}</p>
    </div>`;
  chatContainer.appendChild(div);
}

function createChat6(message, time) {
  const msg = Array.from(message);
  const div = document.createElement("div");
  div.setAttribute("class", "d-flex flex-row justify-content-start");
  div.innerHTML = `<img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
    alt="avatar 1" style="width: 45px; height: 100%;">
    <div>
    ${msg
      .map((item) => {
        return `<p class="small p-2 ms-3 mb-1 rounded-3 font-weight-bold" style="background-color: #f5f6f7;"> ${item.name}  - #${item.price} ordered</p>`;
      })
      .join("")}
    <p class="small ms-3 mb-3 rounded-3 text-muted d-flex justify-content-end font-italic">${time}</p>
    </div>`;
  chatContainer.appendChild(div);
}

function createChat7(message, total) {
  const msg = Array.from(message);
  const div = document.createElement("div");
  div.setAttribute("class", "d-flex flex-row justify-content-start");
  div.innerHTML = `<img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
    alt="avatar 1" style="width: 45px; height: 100%;">
    <div>
    <p class="small p-2 ms-3 mb-1 rounded-3 font-weight-bold" style="background-color: #f5f6f7;"> <u> YOUR ORDERS </u></p>
    ${msg
      .map((item) => {
        return `<p class="small p-2 ms-3 mb-1 rounded-3 font-weight-bold" style="background-color: #f5f6f7;"> ${item.name}  - #${item.price}</p>`;
      })
      .join("")}
      <p class="small p-2 ms-3 mb-1 rounded-3 font-weight-bold" style="background-color: #f5f6f7;"> Total: #${total}</p>
    </div>`;
  chatContainer.appendChild(div);
}

function createChat3(message, time) {
  const msg = Array.from(message);
  const div = document.createElement("div");
  div.setAttribute("class", "d-flex flex-row justify-content-start");
  div.innerHTML = `<img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
    alt="avatar 1" style="width: 45px; height: 100%;">
    <div>
    ${msg
      .map((item) => {
        return `<p class="small p-2 ms-3 mb-1 rounded-3 font-weight-bold" style="background-color: #f5f6f7;">${item}</p>`;
      })
      .join("")}
    <p class="small ms-3 mb-3 rounded-3 text-muted d-flex justify-content-end font-italic">${time}</p>
    </div>`;
  chatContainer.appendChild(div);
}

function createChat4(message, time) {
  const msg = Array.from(message);
  const div = document.createElement("div");
  div.setAttribute("class", "d-flex flex-row justify-content-start");
  div.innerHTML = `<img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
    alt="avatar 1" style="width: 45px; height: 100%;">
    <div>
    ${msg
      .map((item) => {
        return `<p class="small p-2 ms-3 mb-1 rounded-3 font-weight-bold" style="background-color: #f5f6f7;">select ${
          item.id
        } to order ${item.name}  - #${item.price}</p>`;
      })
      .join("")}
    <p class="small ms-3 mb-3 rounded-3 text-muted d-flex justify-content-end font-italic">${time}</p>
    </div>`;
  chatContainer.appendChild(div);
}

function createChat8(message) {
  const msg = Array.from(message);
  //looping through the array of arrays
  let id = 1;
  const div = document.createElement("div");
  div.setAttribute("class", "d-flex flex-sm-column justify-content-start");
  div.innerHTML = `<img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
    alt="avatar 1" style="width: 45px; height: 100%;">
    <p class="small p-2 ms-3 mb-1 rounded-3 font-weight-bold " style="background-color: #f5f6f7;"> <u>YOUR ORDERS</u></p>
    `;
    for (let i = 0; i < msg.length; i++) {
    const item = msg[i];

    div.innerHTML += `<p class="small p-2 ms-3 mb-1 rounded-3 font-weight-bold d-block" style="background-color: #f5f6f7;"> order ${id++} 
       </p>`;
    let total = 0;
    item.forEach((item) => {
      total += item.price;
    });
    item.forEach((item) => {
      div.innerHTML += `<p class="small p-2 ms-3 mb-1 rounded-3 font-weight-bold d-block" style="background-color: #f5f6f7;"> ${item.name} - #${item.price} </p>`;
    });
    div.innerHTML += `<p class="small p-2 ms-3 mb-1 rounded-3 font-weight-bold d-block" style="background-color: #f5f6f7;"> Total: #${total} </p><br>`;
    total = 0;
    }
    
    
  chatContainer.appendChild(div);
}

function createChat9(message) {
  const msg = Array.from(message);
  //looping through the array of arrays

  let id = 1;
  const div = document.createElement("div");
  div.setAttribute("class", "d-flex  justify-content-start");
  div.setAttribute("id", "order")
  div.innerHTML = `<img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
    alt="avatar 1" style="width: 45px; height: 100%;">
    <div>
    <p class="small p-2 ms-3 mb-1 rounded-3 font-weight-bold " style="background-color: #f5f6f7;"> <u>YOUR ORDERS</u></p><br>
    ${msg
    .map((item) => {
      const p = document.createElement("p");
      p.setAttribute("class", "small p-2 ms-3 mb-1 rounded-3 font-weight-bold d-block");
      p.setAttribute("style", "background-color: #f5f6f7;");
      p.innerHTML =
       `order ${id++}
        `;
      const div = document.getElementById("order");
      div.append(p);
      item.forEach((item) => {
        const p1 = document.createElement("p");
        p1.setAttribute("class", "small p-2 ms-3 mb-1 rounded-3 font-weight-bold d-block");
        p1.setAttribute("style", "background-color: #f5f6f7;");
        p1.innerHTML =
          `${item.name} - #${item.price}`;
        const div = document.getElementById("order");
        div.appendChild(p);
        let total = 0;
        item.forEach((item) => {
        total += item.price;
        });
        const p2 = document.createElement("p");
        p2.setAttribute("class", "small p-2 ms-3 mb-1 rounded-3 font-weight-bold d-block");
        p2.setAttribute("style", "background-color: #f5f6f7;");
        p2.innerHTML = ` Total: #${total}`
        total = 0;
      });
      
    })
    .join("")}
    </div>`;
  chatContainer.appendChild(div);
}