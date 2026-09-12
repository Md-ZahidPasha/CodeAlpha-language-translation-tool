# 🌐 AI-Powered Language Translation Tool

An AI-powered language translation web application developed for the **CodeAlpha AI Engineering Virtual Internship – Task 1**.

The application uses the **Google Gemini API** to translate text between multiple languages and provides a simple, responsive interface with additional usability features such as text-to-speech, copy, clear, and language swapping.

## ✨ Features

- 🌐 Translate text between multiple languages
- 🤖 AI-powered translation using Google Gemini API
- 🔍 Automatic source-language detection
- 🔄 Swap source and target languages
- 📋 Copy translated text
- 🔊 Text-to-speech for translated text
- ⏹ Stop speech functionality
- 🔢 Character counter
- 🧹 Clear input and output
- 📱 Responsive and user-friendly interface
- ⚠️ Error handling for failed translation requests

## 🧠 AI Integration

The application uses the **Google Gemini API** as the AI engine.

The Flask backend sends the user's text along with translation instructions to the Gemini model. Gemini processes the text and generates the translated response in the selected target language.

### Translation Flow

User Input  
↓  
Language Selection  
↓  
JavaScript Frontend  
↓  
Flask Backend  
↓  
Google Gemini API  
↓  
AI-Generated Translation  
↓  
Translated Text  
↓  
Copy / Text-to-Speech

## 🛠️ Technologies Used

- **Python**
- **Flask**
- **Google Gemini API**
- **HTML5**
- **CSS3**
- **JavaScript**
- **Web Speech API**
- **python-dotenv**
- **Requests**

## 📂 Project Structure

```text
Language Translation Tool/
│
├── static/
│   ├── scripts.js
│   └── style.css
│
├── templates/
│   └── index.html
│
├── app.py
├── requirements.txt
├── .gitignore
└── .env
