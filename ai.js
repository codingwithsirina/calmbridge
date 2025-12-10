
const sendBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.classList.add('message', type);
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendBtn.addEventListener('click', async () => {
  const message = chatInput.value.trim();
  if (message) {
    addMessage(message, 'sent');
    chatInput.value = '';

    // Appel à l'API IA
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer VOTRE_CLE_API'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: message }]
        })
      });

      const data = await response.json();
      const aiReply = data.choices[0].message.content;
      addMessage(aiReply, 'received');
    } catch (error) {
      addMessage("Erreur : Impossible de contacter l'IA.", 'received');
    }
  }
});
