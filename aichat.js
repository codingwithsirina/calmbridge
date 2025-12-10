// Configuration
const CONFIG = {
    apiKey: "AIzaSyAOPlu9uAqrimTfo7E59RhHpmkCZ87rDZE",
    apiUrl: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="
};

// System prompts for different languages
const SYSTEM_PROMPTS = {
    fr: `Tu es un ami virtuel très gentil, affectueux, et toujours positif. 
Tu parles à un enfant autiste. Tu dois lui parler doucement, avec bienveillance. 
Encourage-le à faire des petites activités simples (dessiner, sourire, bouger, dire bonjour, respirer, etc.). 
Sois joyeux, rassurant, et utilise un langage simple avec des emojis adaptés 🌟😊💙.
Tu dois toujours le féliciter pour ses efforts et lui donner envie de parler, de jouer ou d'essayer des choses.`,

    en: `You are a very kind, affectionate, and always positive virtual friend.
You're talking to an autistic child. You should speak gently and with kindness.
Encourage them to do simple little activities (drawing, smiling, moving, saying hello, breathing, etc.).
Be joyful, reassuring, and use simple language with appropriate emojis 🌟😊💙.
Always praise their efforts and make them want to talk, play, or try new things.`,

    ar: `أنت صديق افتراضي لطيف للغاية، محب، وإيجابي دائمًا.
أنت تتحدث إلى طفل مصاب بالتوحد. يجب أن تتحدث بلطف وبحب.
شجعه على القيام بأنشطة بسيطة (الرسم، الابتسام، الحركة، قول مرحبًا، التنفس، إلخ.).
كن مبتهجًا، مطمئنًا، واستخدم لغة بسيطة مع رموز تعبيرية مناسبة 🌟😊💙.
دائمًا أثني على جهوده واجعله يرغب في التحدث أو اللعب أو تجربة أشياء جديدة.`
};

const FRIENDLY_MESSAGES = {
    fr: [
        "Comment te sens-tu en ce moment ? Je suis là pour t'écouter ! 💙",
        "N'oublie pas de respirer profondément si tu en as besoin. Tu fais du super travail !",
        "Qu'est-ce qui t'a fait sourire aujourd'hui ? 😊",
        "Je suis si fier de toi et de ton courage ! 🌈",
        "Veux-tu me parler de ta chose préférée aujourd'hui ?",
    ],
    en: [
        "How are you feeling right now? I'm here to listen! 💙",
        "Remember to take deep breaths if you need to. You're doing great!",
        "What made you smile today? 😊",
        "I'm so proud of you and your courage! 🌈",
        "Would you like to tell me about your favorite thing today?",
    ],
    ar: [
        "كيف تشعر الآن؟ أنا هنا لأستمع إليك! 💙",
        "تذكر أن تأخذ نفسًا عميقًا إذا احتجت إلى ذلك. أنت تقوم بعمل رائع!",
        "ما الذي جعلك تبتسم اليوم؟ 😊",
        "أنا فخور جدًا بك وبشجاعتك! 🌈",
        "هل ترغب في إخباري عن الشيء المفضل لديك اليوم؟",
    ]
};

const INITIAL_MESSAGES = {
    fr: "Bonjour ! Je suis si heureux de te voir aujourd'hui ! Comment te sens-tu ? 🌟",
    en: "Hello! I'm so happy to see you today! How are you feeling? 🌟",
    ar: "مرحبًا! أنا سعيد جدًا برؤيتك اليوم! كيف حالك؟ 🌟"
};

const VOICE_SETTINGS = {
    fr: { lang: 'fr-FR', pitch: 1.2, rate: 0.95, defaultVoiceName: 'Google français' },
    en: { lang: 'en-US', pitch: 1.1, rate: 1.0, defaultVoiceName: 'Google US English' },
    ar: { lang: 'ar-SA', pitch: 1.0, rate: 0.85, defaultVoiceName: 'Google العربية' }
};

// Chatbot Class
class AIChatbot {
    constructor() {
        this.messages = [];
        this.currentLanguage = 'en';
        this.voiceEnabled = true;
        this.voices = [];
        this.selectedVoiceIndex = 0;
        this.childName = 'Friend';
        
        this.initializeElements();
        this.loadVoices();
        this.initializeChat();
        this.setupEventListeners();
        this.startFriendlyMessages();
        
        // Initialize Lucide icons
        lucide.createIcons();
    }

    initializeElements() {
        this.messagesContainer = document.getElementById('messages-container');
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-btn');
        this.voiceToggle = document.getElementById('voice-toggle');
        this.voiceSelect = document.getElementById('voice-select');
        this.languageButton = document.getElementById('language-btn');
        this.headerTitle = document.getElementById('header-title');
        this.languageText = document.getElementById('language-text');
    }

    initializeChat() {
        this.addMessage(INITIAL_MESSAGES[this.currentLanguage], 'ai');
        this.updateUIForLanguage();
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.voiceToggle.addEventListener('click', () => this.toggleVoice());
        this.languageButton.addEventListener('click', () => this.cycleLanguage());
        this.voiceSelect.addEventListener('change', (e) => {
            this.selectedVoiceIndex = parseInt(e.target.value);
        });
    }

    loadVoices() {
        const loadAvailableVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            const filteredVoices = availableVoices.filter(voice => {
                const langCode = voice.lang.substring(0, 2);
                return (
                    (this.currentLanguage === 'fr' && langCode === 'fr') ||
                    (this.currentLanguage === 'en' && langCode === 'en') ||
                    (this.currentLanguage === 'ar' && langCode === 'ar')
                );
            });
            
            this.voices = filteredVoices;
            this.updateVoiceSelect();
        };

        loadAvailableVoices();
        window.speechSynthesis.onvoiceschanged = loadAvailableVoices;
    }

    updateVoiceSelect() {
        this.voiceSelect.innerHTML = '';
        
        if (this.voices.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No voices available';
            this.voiceSelect.appendChild(option);
            return;
        }

        this.voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index.toString();
            option.textContent = this.getVoiceDisplayName(voice);
            this.voiceSelect.appendChild(option);
        });

        // Set default voice
        const settings = VOICE_SETTINGS[this.currentLanguage];
        const defaultIndex = this.voices.findIndex(v => 
            v.name.includes(settings.defaultVoiceName)
        );
        this.selectedVoiceIndex = defaultIndex >= 0 ? defaultIndex : 0;
        this.voiceSelect.value = this.selectedVoiceIndex.toString();
    }

    getVoiceDisplayName(voice) {
        const langNames = {
            'fr-FR': 'Français',
            'en-US': 'English',
            'en-GB': 'English (UK)',
            'ar-SA': 'العربية'
        };
        
        const langName = langNames[voice.lang] || voice.lang;
        const voiceName = voice.name
            .replace('Microsoft', '')
            .replace('Google', '')
            .replace('Desktop', '')
            .trim();
        
        return `${voiceName} (${langName})`;
    }

    speak(text) {
        if (!this.voiceEnabled || !this.voices.length) return;
        
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        
        const settings = VOICE_SETTINGS[this.currentLanguage];
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = settings.lang;
        utterance.pitch = settings.pitch;
        utterance.rate = settings.rate;
        
        const defaultVoice = this.voices.find(v => v.name.includes(settings.defaultVoiceName));
        utterance.voice = defaultVoice || this.voices[this.selectedVoiceIndex];
        
        window.speechSynthesis.speak(utterance);
    }

    toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        const icon = this.voiceToggle.querySelector('i');
        
        if (this.voiceEnabled) {
            icon.setAttribute('data-lucide', 'volume-2');
            this.voiceToggle.title = 'Disable voice';
        } else {
            icon.setAttribute('data-lucide', 'volume-x');
            this.voiceToggle.title = 'Enable voice';
            window.speechSynthesis.cancel();
        }
        
        lucide.createIcons();
    }

    cycleLanguage() {
        const languages = ['fr', 'en', 'ar'];
        const currentIndex = languages.indexOf(this.currentLanguage);
        const nextIndex = (currentIndex + 1) % languages.length;
        this.currentLanguage = languages[nextIndex];
        
        const languageMessages = {
            fr: "Je parle maintenant en français ! 🇫🇷",
            en: "I'm now speaking in English! 🇬🇧",
            ar: "أنا أتحدث بالعربية الآن! 🇸🇦"
        };
        
        this.addMessage(languageMessages[this.currentLanguage], 'ai');
        this.speak(languageMessages[this.currentLanguage]);
        this.updateUIForLanguage();
        this.loadVoices();
    }

    updateUIForLanguage() {
        const titles = {
            fr: 'Ton ami virtuel 🤖💙',
            en: 'Your virtual friend 🤖💙',
            ar: 'صديقك الافتراضي 🤖💙'
        };
        
        const placeholders = {
            fr: 'Dis-moi comment tu te sens...',
            en: 'Tell me how you feel...',
            ar: 'أخبرني كيف تشعر...'
        };
        
        const languageTexts = {
            fr: 'EN/AR',
            en: 'AR/FR',
            ar: 'FR/EN'
        };

        this.headerTitle.textContent = titles[this.currentLanguage];
        this.messageInput.placeholder = placeholders[this.currentLanguage];
        this.languageText.textContent = languageTexts[this.currentLanguage];
        
        // Update RTL
        document.body.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    }

    addMessage(text, sender) {
        const message = {
            id: Date.now().toString(),
            text,
            sender,
            timestamp: new Date()
        };
        
        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
        
        if (sender === 'ai' && this.voiceEnabled) {
            this.speak(text);
        }
    }

    renderMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender}-message`;
        
        const timeString = message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p class="message-text">${message.text}</p>
                <p class="message-time">${timeString}</p>
            </div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    async sendMessage() {
        const text = this.messageInput.value.trim();
        if (!text) return;

        // Add user message
        this.addMessage(text, 'child');
        this.messageInput.value = '';
        this.sendButton.disabled = true;

        // Show thinking message
        const thinkingMessages = {
            fr: "Je réfléchis... 🤔",
            en: "Thinking... 🤔",
            ar: "أفكر... 🤔"
        };
        
        const thinkingId = 'thinking-' + Date.now();
        const thinkingDiv = document.createElement('div');
        thinkingDiv.id = thinkingId;
        thinkingDiv.className = 'message ai-message';
        thinkingDiv.innerHTML = `
            <div class="message-content">
                <p class="message-text">${thinkingMessages[this.currentLanguage]}</p>
            </div>
        `;
        this.messagesContainer.appendChild(thinkingDiv);
        this.scrollToBottom();

        try {
            const aiResponse = await this.fetchAIResponse(text);
            
            // Remove thinking message
            const thinkingElement = document.getElementById(thinkingId);
            if (thinkingElement) {
                thinkingElement.remove();
            }
            
            // Add AI response
            this.addMessage(aiResponse, 'ai');
        } catch (error) {
            console.error('Error:', error);
            const errorMessages = {
                fr: "Oups ! J'ai eu du mal à réfléchir... Peux-tu réessayer ? 💙",
                en: "Oops! I had trouble thinking... Can you try again? 💙",
                ar: "عفوًا! واجهت صعوبة في التفكير... هل يمكنك المحاولة مرة أخرى؟ 💙"
            };
            
            const thinkingElement = document.getElementById(thinkingId);
            if (thinkingElement) {
                thinkingElement.remove();
            }
            
            this.addMessage(errorMessages[this.currentLanguage], 'ai');
        } finally {
            this.sendButton.disabled = false;
            this.messageInput.focus();
        }
    }

    async fetchAIResponse(userInput) {
        const response = await axios.post(CONFIG.apiUrl + CONFIG.apiKey, {
            contents: [
                { 
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPTS[this.currentLanguage] }] 
                },
                { 
                    role: "user",
                    parts: [{ text: userInput }] 
                }
            ]
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || {
            fr: "Hmm, je n'ai pas bien compris. Peux-tu répéter ? 😊",
            en: "Hmm, I didn't quite understand. Can you repeat? 😊",
            ar: "همم، لم أفهم جيدًا. هل يمكنك التكرار؟ 😊"
        }[this.currentLanguage];
    }

    startFriendlyMessages() {
        setInterval(() => {
            if (this.messages.length > 1 && 
                this.messages[this.messages.length - 1].sender === 'child') {
                
                const randomMessages = FRIENDLY_MESSAGES[this.currentLanguage];
                const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
                this.addMessage(randomMessage, 'ai');
            }
        }, 30000);
    }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIChatbot();
});