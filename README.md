# 🎓 المستشار الأكاديمي الذكي (مهره وفاطمه) | AI Academic Advisor (Mahra & Fatima)

مرحباً بك في مشروع **المستشار الأكاديمي الذكي (مهره وفاطمه)**! هذا المشروع عبارة عن روبوت محادثة ذكي تفاعلي (Chatbot) ثنائي اللغة ينطق بالعربية عبر الذكاء الاصطناعي (Neural Voices) ويساعد الطلاب في الإرشاد الأكاديمي واللوائح الجامعية.

Welcome to the **Mahra & Fatima AI Academic Advisor** project! This is a bilingual, voice-interactive smart chatbot using cutting-edge Neural AI to assist students with university regulations and academic advising.

---

## ✨ المميزات | Features
1. **ثنائي اللغة (Bilingual)**: يدعم اللغتين العربية والإنجليزية بطلاقة.
2. **نطق عصبي متطور (Edge-TTS Neural Voice)**: نطق عربي بشري طبيعي جداً (بصوت ar-AE-FatimaNeural) ونطق إنجليزي ممتاز.
3. **ذكاء اصطناعي عبر Gemini**: يستخدم نماذج `gemini` الحديثة لتقديم إجابات دقيقة تفاعلية بناءً على قاعدة المعرفة الخاصة بالجامعة.
4. **واجهة مستخدم احترافية (Premium UI)**: تصميم عصري زجاجي (Glassmorphism) مع دعم كامل (RTL/LTR) تلقائي للاتجاهات.
5. **قاعدة معرفة متكاملة (Knowledge Base)**: محرك لمعالجة اللوائح والنصوص الجامعية، وعرضها بشكل مرتب وتفاعلي ذكي.

---

## 🚀 دليل التشغيل (Operation Guide)

### 1️⃣ المتطلبات المسبقة (Prerequisites)
تأكد من تنصيب البرامج التالية على جهازك:
- [Python 3.8+](https://www.python.org/downloads/)
- حساب مفعل للحصول على مفتاح API من [Google AI Studio](https://aistudio.google.com/).

### 2️⃣ التثبيت (Installation)
افتح موجه الأوامر (Terminal/CMD) واكتب الأوامر التالية خطوة بخطوة:

```bash
# 1. استنساخ المستودع (Clone the repository)
git clone https://github.com/Ibronux7bro/Bilingual-AI-Chatbot.git

# 2. الدخول للمجلد
cd Bilingual-AI-Chatbot

# 3. تثبيت المكتبات المطلوبة (Install dependencies)
pip install -r requirements.txt
pip install edge-tts
```

### 3️⃣ إعداد البيئة (Environment Setup)
قم بإنشاء ملف باسم `.env` في المسار الرئيسي للمشروع، وأضف بداخله مفتاح Gemini API الخاص بك كالتالي:
```ini
GEMINI_API_KEY=ضع_مفتاحك_هنا
```

### 4️⃣ التشغيل (Running the Project)
قم بتشغيل السيرفر المحلي عبر الأمر التالي:
```bash
python app.py
```
بعد تشغيل السيرفر، افتح متصفحك وادخل على الرابط:  
🌐 [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 🛠️ التقنيات المستخدمة | Technologies
- **Backend:** Python, Flask
- **Frontend:** HTML5, CSS3 (Glassmorphism), Vanilla JavaScript
- **AI & TTS:** Google Gemini API, Edge-TTS (Microsoft Neural Voices)

---

**تم تصميم وتطوير هذا النظام حصرياً لدعم الطلاب وتسهيل رحلتهم الأكاديمية.**  
**فريق العمل في كلية الإمام مالك للشريعة والقانون:**  
- 252130009 شيخه محمد الخالدي  
- سيف حسن المرزوقي 251120001 مسائي  
- مهره غانم نصيب  
- فاطمه علي البلوشي  
- عاشه خالد
