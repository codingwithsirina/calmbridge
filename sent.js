function sendMessage() {
    const input = document.getElementById('chat-input');
    const messageText = input.value.trim();

    if (messageText !== "") {
        // Créer un nouveau message
        const newMessage = document.createElement('div');
        newMessage.classList.add('message', 'sent'); // Style pour message envoyé
        newMessage.textContent = messageText;

        // Ajouter le message dans la zone de chat
        const chatBox = document.getElementById('chat-box');
        chatBox.appendChild(newMessage);

        // Scroll automatique vers le bas
        chatBox.scrollTop = chatBox.scrollHeight;

        // Vider le champ
        input.value = "";
    }
    
}
const input = document.getElementById('chat-input');
const messageText = input.value.trim();
 if (messageText !== "") {
        // Afficher le message de l'enfant
        const userMsg = document.createElement('div');
        userMsg.classList.add('message', 'sent');
        userMsg.textContent = messageText;
        chatBox.appendChild(userMsg);
        chatBox.scrollTop = chatBox.scrollHeight;
        input.value = "";

        // Envoyer à l'API backend
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: messageText })
        });

        const data = await response.json();

        // Afficher la réponse du chatbot
        const botMsg = document.createElement('div');
        botMsg.classList.add('message');
        botMsg.textContent = data.reply;
        chatBox.appendChild(botMsg);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

