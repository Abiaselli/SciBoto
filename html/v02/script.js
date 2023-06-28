const chatArea = document.getElementById('chat-area');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', sendMessage);


messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value;
    if (!message.trim()) {
        return;
    }

    addMessageToChatArea('User', message);
    messageInput.value = '';

    // get conversation thread_id from URL
    const urlParams = new URLSearchParams(window.location.search);
    const conversation = urlParams.get('c');    
    
    fetch('agent.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'message=' + encodeURIComponent(message) + '&conversation=' + encodeURIComponent(conversation)
    })
    .then(response => response.text())
    .then(agentResponse => {
        addMessageToChatArea('CFNBot', agentResponse);
    });
}

function addMessageToChatArea(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message} <br><br>`;
    chatArea.appendChild(messageElement);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function retrieveConversationHistory() {

    // get conversation thread_id from URL
    const urlParams = new URLSearchParams(window.location.search);
    const conversation = urlParams.get('c');    
    
    fetch(`history.php?conversation=${encodeURIComponent(conversation)}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(history => {
        history.forEach(item => {
            addMessageToChatArea(item.sender, item.message);
        });
    });
}
