const express = require('express');
const formatMessage = require('./utils/message');
const { commands, menu } = require('./utils/botResponse');
const path = require('path');
const socketIO = require('socket.io');
const moment = require('moment');

const app = express();

app.set('port', 3000);
app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.get('/', function (request, response) {
    response.sendFile('index.html');
});

// Starts the server.
const server = app.listen(3000, function () {
    console.log('Starting server on port 3000');
});

const io = socketIO(server);

let allOrders = [];

let id = 1;

let multipleOrders = [];

let orders = [];

// Add the WebSocket handlers
io.on('connection', function (socket) {
    //introduce restaurant
    socket.emit('welcomeMessage', formatMessage('Welcome to shandy\'s restaurant!'));
    socket.emit('commands', formatMessage(commands));

    //listen for chat message
    socket.on('chatMessage', function (msg) {
        socket.emit('chatMessage', formatMessage(msg));

        if (msg === "1") {
            socket.emit('menu', formatMessage(menu));

            //emit to change the submit button
            socket.emit('changeSubmitBtn');
        } else if (msg === "99"|| msg === "97" || msg === "0") {
            socket.emit('orderCheckedOut', formatMessage('you need to place an order first'));

            //emit commands to the client
            socket.emit('commands', formatMessage(commands));
        } else if (msg === "98") {
            //emit all orders to the client
            socket.emit('allOrders', allOrders);
            socket.emit('commands', formatMessage(commands));
        } else {
            socket.emit('commands', formatMessage(commands));
        }
    });

    

    //listen for second chat message
    socket.on('chatMessage2', function (msg) {
        socket.emit('chatMessage', formatMessage(msg));

        const splittedOrder = msg.split(",") //split multiple orders

        if (splittedOrder.length > 1) {
            //check if the order is in the menu
            for (let i = 0; i < splittedOrder.length; i++) {
                if (menu[splittedOrder[i] - 1] === undefined) {
                    socket.emit('orderNotInMenu', formatMessage('Order not in menu'));
                    return;
                }
            }
            //empty the multiple orders array
            multipleOrders = [];

            //push the order into the order array and multiple orders array
            for (let i = 0; i < splittedOrder.length; i++) {
                orders.push(menu[splittedOrder[i] - 1]);
                multipleOrders.push(menu[splittedOrder[i] - 1]);
            }

            //emit multiple orders picked to the client
            socket.emit('multipleOrdersPicked', formatMessage(multipleOrders));

            //emit the order to the client
            socket.emit('order', orders);
        } else {

            //check if the order is in the menu
            if (menu[Number(msg) - 1] === undefined && msg !== "99"  && msg !== "97" && msg !== "0") {
                socket.emit('orderNotInMenu', formatMessage('Order not in menu'));
            } else if (msg === "99") {
                //check if the order array is empty
                if (orders.length === 0) {
                    socket.emit('orderCheckedOut', formatMessage('you need to place an order first'));
                } else {
                    socket.emit('orderCheckedOut', formatMessage('your order has been checked out'));

                    //push the orders into allOrders array
                    allOrders.push(orders);
                    
                    //clear the orders array
                    orders = [];

                    //change the submit button
                    socket.emit('changeSubmitBtn2');

                    //emit the commands to the client
                    socket.emit('commands', formatMessage(commands));

                }
            } else if (msg === "0") { 
                //check if the order array is empty
                if (orders.length === 0) {
                    socket.emit('orderCheckedOut', formatMessage('you need to place an order first'));
                } else {
                    socket.emit('orderCheckedOut', formatMessage('your order has been canceled'));

                    //clear the orders array
                    orders = [];

                    //change the submit button
                    socket.emit('changeSubmitBtn2');

                    //emit the commands to the client
                    socket.emit('commands', formatMessage(commands));

                }
            }
            else if (msg === "97") {
                //check if the order array is empty
                if (orders.length === 0) {
                    socket.emit('orderCheckedOut', formatMessage('you need to place an order first'));
                } else {
                    socket.emit('orders', orders);
                }
            } else {
            
           
                //push the order into the order array
                orders.push(menu[msg - 1]);

                //emit order picked to the client
                socket.emit('orderPicked', formatMessage(menu[msg - 1]));

                //emit the order to the client
                socket.emit('order', orders);
            
            }
        }

    });

    //listen for disconnect
    socket.on('disconnect', function () {
        console.log('user disconnected');
        allOrders = [];
    });
});
