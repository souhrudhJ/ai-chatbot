class ChatUI {
  constructor() {
    this.chatInput = document.querySelector('.chat-input');
    this.chatContainer = document.querySelector('.container');
    this.welcomeMsg = document.querySelector('.welcome-msg');
    this.isFirstMessage = true;
    this.messagesContainer = document.querySelector('.messages-container');

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.chatInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.handleUserMessage();
      }
    });
  }

  async handleUserMessage() {
    const userMessage = this.chatInput.value.trim();

    if (userMessage === '') return;
    
    if (this.isFirstMessage) {
      this.fadeOutWelcomeMessage();
      this.isFirstMessage = false;
    }

    // Display user message
    this.createMessageBubble(userMessage, 'user');
    
    // Show thinking indicator
    const thinkingBubble = this.createThinkingBubble();
    
    try {
      // Send request to your Python backend
      const response = await this.fetchGeminiResponse(userMessage);
      
      // Remove thinking bubble
      this.messagesContainer.removeChild(thinkingBubble);
      
      // Display bot response
      this.createMessageBubble(response, 'bot');
    } catch (error) {
      // Remove thinking bubble
      this.messagesContainer.removeChild(thinkingBubble);
      
      // Display error message
      this.createMessageBubble("Sorry, I'm having trouble connecting right now. Please try again later.", 'bot');
      console.error("Error fetching response:", error);
    }

    // Clear input field
    this.chatInput.value = '';
  }

  async fetchGeminiResponse(message) {
    // Replace with your actual backend endpoint
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: message })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  }

  createThinkingBubble() {
    const thinkingBubble = document.createElement('div');
    thinkingBubble.classList.add('message-bubble', 'bot-message', 'thinking');
    thinkingBubble.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    
    this.messagesContainer.appendChild(thinkingBubble);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    
    return thinkingBubble;
  }

  fadeOutWelcomeMessage() {
    this.welcomeMsg.classList.add('fade-out');
    this.chatContainer.classList.add('container-small');    
    setTimeout(() => {
      this.welcomeMsg.style.display = 'none';
    }, 500); 
  }

  createMessageBubble(message, sender) {
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message-bubble', `${sender}-message`);
    messageBubble.textContent = message;

    this.messagesContainer.appendChild(messageBubble);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ChatUI();
});