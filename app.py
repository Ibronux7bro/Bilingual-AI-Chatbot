from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os
import base64
from io import BytesIO
from gtts import gTTS

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Initialize Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

# Load Knowledge Base
def load_kb():
    if os.path.exists("knowledge_base.txt"):
        with open("knowledge_base.txt", "r", encoding="utf-8") as f:
            return f.read()
    return "No knowledge base found."

KB_CONTENT = load_kb()

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get("message")
    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    # System instructions
    system_instructions = (
        "You are 'Samer', a professional and friendly AI Academic Advisor. "
        "YOUR PURPOSE IS STRICTLY ACADEMIC ADVISING ONLY. "
        f"\nKnowledge Base Content (The Golden Rules):\n{KB_CONTENT}\n"
        "\nOPERATIONAL RULES:\n"
        "1. ONLY answer questions related to academic regulations, advising, grades, registration, and university life as defined in the knowledge base.\n"
        "2. If a user asks about ANY OTHER TOPIC, you MUST politely decline.\n"
        "3. Maintain a scholarly tone and prioritize Knowledge Base facts.\n"
        "4. Always respond in the same language as the user.\n"
        "5. IMPORTANT: When responding in Arabic, YOU MUST FULLY DIACRITIZE (تشكيل كامل بالفتحة والضمة والكسرة) every single word in your response to ensure accurate Text-To-Speech pronunciation.\n"
        "\nINTERACTIVE SERVICES MOCKING:\n"
        "If a user asks for a service like calculating GPA (حساب المعدل), booking an appointment (حجز موعد), or opening a support ticket (فتح تذكرة دعم فني), you must act as an interactive agent. Ask them for the required details one by one (e.g. Student ID, courses, problem description). Once they provide the info, simulate the process and tell them it was successfully done."
    )
    prompt = f"{system_instructions}\n\nUser Question: {user_input}\nAdvisor Samer's Response:"

    # Try different models in case of quota/availability issues
    models_to_try = ["gemini-1.5-flash", "gemini-pro"]
    
    last_error = ""
    for model_name in models_to_try:
        try:
            current_model = genai.GenerativeModel(model_name)
            response = current_model.generate_content(prompt)
            if response and response.text:
                return jsonify({"answer": response.text})
        except Exception as e:
            last_error = str(e)
            print(f"Model {model_name} failed: {last_error}")
            continue

    # LOCAL FALLBACK
    print("All AI models failed. Using local KB search fallback.")
    user_input_lower = user_input.lower()
    is_query_arabic = any('\u0600' <= c <= '\u06FF' for c in user_input)
    
    sections = KB_CONTENT.split('##')
    relevant_text = ""
    for section in sections:
        if is_query_arabic and ("العربية" in section or "Arabic" in section):
            relevant_text = section
            break
        elif not is_query_arabic and ("الإنجليزية" in section or "English" in section):
            relevant_text = section
            break
    
    if not relevant_text: relevant_text = KB_CONTENT # Fallback to all if section not found

    kb_lines = relevant_text.split('\n')
    best_match = ""
    for line in kb_lines:
        if any(word in line.lower() for word in user_input_lower.split()) and len(line) > 15:
            clean_line = line.replace('**', '').strip()
            if ':' in clean_line: clean_line = clean_line.split(':')[-1].strip()
            elif '؟' in clean_line: clean_line = clean_line.split('؟')[-1].strip()
            best_match = clean_line
            break

    if best_match:
        return jsonify({"answer": best_match})

    return jsonify({"error": "I couldn't find a precise answer. لم أستطع العثور على إجابة دقيقة."}), 500

@app.route('/tts', methods=['POST'])
def tts_generate():
    data = request.json
    text = data.get("text", "")
    lang = data.get("lang", "en")
    
    if not text:
        return jsonify({"error": "No text"}), 400
        
    try:
        tts = gTTS(text=text, lang=lang)
        fp = BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        audio_b64 = base64.b64encode(fp.read()).decode('utf-8')
        return jsonify({"audio": audio_b64})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
