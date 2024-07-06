const socket = io('http://localhost:3000');

const chat_box = document.getElementById('message-container');
const form_data = document.getElementById('send-container');
const form_input = document.getElementById('message-input');


const add_messages = (message, isOwnMessage) => {
    const new_message = document.createElement('div');
    new_message.id = isOwnMessage ? 'own-message' : 'other-message';

    if(!isOwnMessage) {
        const outer_div = document.createElement('div');
        outer_div.id = 'outer-div';

        const name_div = document.createElement('span');
        name_div.innerText = message.Name;
        name_div.id = 'Name-div';

        outer_div.appendChild(name_div);

        new_message.appendChild(outer_div);
    }

    const message_div = document.createElement('div');
    message_div.innerText = message.message;
    message_div.id = 'Content-div';
    new_message.appendChild(message_div);

    chat_box.append(new_message);
}

const welcome_message = (message) => {
    const new_message = document.createElement('div');
    new_message.id = 'welcome';
    new_message.innerText = message;
    chat_box.append(new_message);
}

const leaving_messages = (message) => {
    const new_message = document.createElement('div');
    new_message.id = 'welcome';
    new_message.innerText = message;
    chat_box.append(new_message);
}

const User = prompt('Enter Your Name');

welcome_message(`${User} Joined Chat!`);

socket.emit('new-user-joined', User);


socket.on('chat-message', data => {
    add_messages(data, false);
    scrollToBottom();
})

socket.on('user-join-message', data => {
    welcome_message(`${data} Joined Chat!`);
    scrollToBottom();
})

socket.on('user-disconnected', Name => {
    leaving_messages(`${Name} Left the Chat!`);
    scrollToBottom();
})

form_data.addEventListener('submit', e => {
    e.preventDefault();

    const message = form_input.value;

    const obj = {
        'Name' : 'You',
        'message' : message
    }

    add_messages(obj, true);
    socket.emit('send-chat-message', message);
    form_input.value = '';
    scrollToBottom();
})

const scrollToBottom = () => {
    chat_box.scrollTop = chat_box.scrollHeight;
}