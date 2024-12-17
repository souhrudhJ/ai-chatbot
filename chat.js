// Chat functionality for samanthaChat

// Chat bot response generation
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

  // Generate a response based on user input
  generateResponse(userMessage) {
    // Convert message to lowercase for easier matching
    const message = userMessage.toLowerCase().trim();

    // Check for specific intents
    if (message.includes('hello') || message.includes('hi')) {
      return this.getRandomResponse('greeting');
    }

    // Default response if no specific intent is matched
    return this.getRandomResponse('default');
  }

  // Helper method to get a random response from a category
  getRandomResponse(category) {
    const responses = this.responses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Chat UI functionality
class ChatUI {
  constructor() {
    this.chatBot = new ChatBot();
    this.chatInput = document.querySelector('.chat-input');
    this.chatContainer = document.querySelector('.container');
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Handle input submission on Enter key
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

    // Create and append user message bubble
    this.createMessageBubble(userMessage, 'user');

    // Generate and append bot response
    const botResponse = this.chatBot.generateResponse(userMessage);
    setTimeout(() => {
      this.createMessageBubble(botResponse, 'bot');
    }, 500);

    // Clear input
    this.chatInput.value = '';
  }

  createMessageBubble(message, sender) {
    // Create message element
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message-bubble', `${sender}-message`);
    messageBubble.textContent = message;

    const messagesContainer = document.querySelector('.messages-container');

    // Append to chat container
    messagesContainer.appendChild(messageBubble);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

// Initialize chat when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  new ChatUI();
});