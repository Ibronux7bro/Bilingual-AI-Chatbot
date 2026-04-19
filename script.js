const micBtn = document.getElementById('micBtn');
const sendBtn = document.getElementById('sendBtn');
const manualInput = document.getElementById('manualInput');
const chatContainer = document.getElementById('chatContainer');
const statusTxt = document.getElementById('statusTxt');
const orb = document.getElementById('orb');
const arBtn = document.getElementById('arBtn');
const enBtn = document.getElementById('enBtn');
const typingIndicator = document.getElementById('typingIndicator');
const navChat = document.getElementById('navChat');
const navKb = document.getElementById('navKb');
const typingText = document.querySelector('#typingIndicator p');

let currentLang = 'ar-SA';

// Pre-load voices for better reliability in browsers like Chrome
window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
};

// Lang Toggle Logic
arBtn.onclick = () => {
    currentLang = 'ar-SA';
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.classList.add('rtl');
    arBtn.classList.add('active');
    enBtn.classList.remove('active');
    
    // Update UI Text (Arabic)
    headerTitle.innerText = "المستشار سامر";
    headerStatus.innerText = "متصل الآن";
    statusTxt.innerText = "انقر على الميكروفون للتحدث";
    manualInput.placeholder = "اكتب سؤالك هنا...";
    navChat.innerText = "المحادثة المباشرة";
    navKb.innerText = "قاعدة المعرفة";
    typingText.innerText = "سامر يفكر...";
    
    toggleLanguageVisibility('ar');
};

enBtn.onclick = () => {
    currentLang = 'en-US';
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    document.body.classList.remove('rtl');
    enBtn.classList.add('active');
    arBtn.classList.remove('active');
    
    // Update UI Text (English)
    headerTitle.innerText = "Samer AI Advisor";
    headerStatus.innerText = "Online";
    statusTxt.innerText = "Click the microphone to speak";
    manualInput.placeholder = "Type your question here...";
    navChat.innerText = "Live Chat";
    navKb.innerText = "Knowledge Base";
    typingText.innerText = "Samer is analyzing...";
    
    toggleLanguageVisibility('en');
};

function toggleLanguageVisibility(lang) {
    const arTexts = document.querySelectorAll('.ar-text');
    const enTexts = document.querySelectorAll('.en-text');
    
    if (lang === 'ar') {
        arTexts.forEach(el => el.style.display = 'block');
        enTexts.forEach(el => el.style.display = 'none');
    } else {
        arTexts.forEach(el => el.style.display = 'none');
        enTexts.forEach(el => el.style.display = 'block');
    }
}

// Speech Recognition Setup
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = Recognition ? new Recognition() : null;

if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        orb.classList.add('listening');
        micBtn.classList.add('active');
        statusTxt.innerText = currentLang === 'ar-SA' ? "أنا أسمعك..." : "Listening...";
    };

    recognition.onend = () => {
        orb.classList.remove('listening');
        micBtn.classList.remove('active');
        statusTxt.innerText = currentLang === 'ar-SA' ? "انقر للتحدث" : "Click to talk";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        manualInput.value = transcript;
        processQuery(transcript);
    };

    recognition.onerror = () => {
        statusTxt.innerText = currentLang === 'ar-SA' ? "خطأ في الاتصال" : "Connection Error";
    };
}

// Prime speech synthesis on first user interaction to bypass browser blocks
function primeSpeech() {
    if ('speechSynthesis' in window) {
        const silent = new SpeechSynthesisUtterance(' ');
        silent.volume = 0;
        window.speechSynthesis.speak(silent);
        console.log("Speech Engine Primed");
    }
}

micBtn.onclick = () => {
    primeSpeech(); // Unblock voice
    if (recognition) {
        recognition.lang = currentLang;
        recognition.start();
    } else {
        alert("متصفحك لا يدعم التعرف على الصوت.");
    }
};

sendBtn.onclick = () => {
    primeSpeech(); // Unblock voice
    const text = manualInput.value.trim();
    if (text) processQuery(text);
};

manualInput.onkeypress = (e) => {
    if (e.key === 'Enter') {
        primeSpeech();
        sendBtn.click();
    }
};

async function processQuery(message) {
    addBubble(message, 'user');
    manualInput.value = '';
    
    // Show Typing Indicator
    typingIndicator.style.display = 'flex';
    statusTxt.innerText = currentLang === 'ar-SA' ? "جاري التفكير..." : "Analyzing your query...";
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        const res = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await res.json();
        
        // Hide Typing Indicator
        typingIndicator.style.display = 'none';
        
        if (data.answer) {
            addBubble(data.answer, 'ai');
            playVoice(data.answer);
        } else {
            addBubble(data.error || "Error occuried", 'ai');
        }
    } catch (err) {
        typingIndicator.style.display = 'none';
        statusTxt.innerText = "Error: " + err.message;
    }
}

async function playVoice(text) {
    const isArabic = /[\u0600-\u06FF]/.test(text);
    const targetLangCode = isArabic ? 'ar' : 'en';

    statusTxt.innerText = currentLang === 'ar-SA' ? "جاري التحدث..." : "Responding...";
    orb.classList.add('speaking');

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }

    try {
        const cleanText = text.replace(/[*#_]/g, ''); // Remove markdown
        
        const res = await fetch('/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: cleanText, lang: targetLangCode })
        });
        
        const data = await res.json();
        
        if (data.audio) {
            const audio = new Audio("data:audio/mp3;base64," + data.audio);
            await new Promise((resolve, reject) => {
                audio.onended = resolve;
                audio.onerror = reject;
                audio.play().catch(reject);
            });
        } else {
            throw new Error(data.error || "No audio returned");
        }
        
        orb.classList.remove('speaking');
        statusTxt.innerText = currentLang === 'ar-SA' ? "جاهز" : "Ready";
        
    } catch (err) {
        console.error("Cloud TTS failed, using native fallback:", err);
        fallbackNativeSpeech(text, isArabic ? 'ar-SA' : 'en-US');
    }
}

function fallbackNativeSpeech(text, targetLang) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    utterance.onend = () => {
        orb.classList.remove('speaking');
        statusTxt.innerText = currentLang === 'ar-SA' ? "جاهز" : "Ready";
    };
    utterance.onerror = () => {
        orb.classList.remove('speaking');
        statusTxt.innerText = currentLang === 'ar-SA' ? "خطأ في الصوت" : "Voice Error";
    };
    window.speechSynthesis.speak(utterance);
}

function addBubble(text, type) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const bubble = document.createElement('div');
    bubble.className = `message ${type}-bubble`;
    
    const avatarChar = type === 'ai' ? 'S' : 'U';
    const speakBtn = type === 'ai' ? `<button class="bubble-speak" onclick="playVoice(\`${text.replace(/`/g, '\\`').replace(/\n/g, ' ')}\`)"><i class="fas fa-volume-up"></i></button>` : '';

    bubble.innerHTML = `
        <div class="avatar">${avatarChar}</div>
        <div class="bubble-content">
            <p>${text}</p>
            <div class="bubble-footer">
                ${speakBtn}
                <span class="time">${time}</span>
            </div>
        </div>
    `;
    
    chatContainer.appendChild(bubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
