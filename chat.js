class ChatBot {
  constructor() {
    this.responses = {
      greeting: [
        "Hello there! How can I help you today?",
        "Hi! What's on your mind?",
        "Greetings! I'm ready to chat."
      ],
      default: [
        "That's interesting! Tell me more.",
        "I'm listening. What else would you like to share?",
        "Could you elaborate on that?"
      ]
    };
  }

  generateResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();

    if (message.includes('hello') || message.includes('hi')) {
      return this.getRandomResponse('greeting');
    }

    return this.getRandomResponse('default');
  }

  getRandomResponse(category) {
    const responses = this.responses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

class ChatUI {
  constructor() {
    this.chatBot = new ChatBot();
    this.chatInput = document.querySelector('.chat-input');
    this.chatContainer = document.querySelector('.container');
    this.welcomeMsg = document.querySelector('.welcome-msg');
    this.isFirstMessage = true;

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

  handleUserMessage() {
    const userMessage = this.chatInput.value.trim();

    if (userMessage === '') return;

    
    if (this.isFirstMessage) {
      this.fadeOutWelcomeMessage();
      this.isFirstMessage = false;
    }

    // User message bubble
    this.createMessageBubble(userMessage, 'user');

    // Bot response
    const botResponse = this.chatBot.generateResponse(userMessage);
    setTimeout(() => {
      this.createMessageBubble(botResponse, 'bot');
    }, 500);

    
    this.chatInput.value = '';
  }

  fadeOutWelcomeMessage() {
    
    this.welcomeMsg.classList.add('fade-out');
    

    setTimeout(() => {
      this.welcomeMsg.style.display = 'none';
    }, 500); 
  }

  createMessageBubble(message, sender) {
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message-bubble', `${sender}-message`);
    messageBubble.textContent = message;

    const messagesContainer = document.querySelector('.messages-container');
    messagesContainer.appendChild(messageBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ChatUI();
});