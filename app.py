from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Get Gemini API key from .env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Gemini API endpoint
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/"
    "v1beta/models/gemini-3.5-flash:generateContent"
)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/translate", methods=["POST"])
def translate():
    try:
        data = request.get_json()

        text = data.get("text", "").strip()
        source_language = data.get("source_language", "auto")
        target_language = data.get("target_language", "en")

        # Check input
        if not text:
            return jsonify({
                "success": False,
                "error": "Please enter some text to translate."
            }), 400

        # Check API key
        if not GEMINI_API_KEY:
            return jsonify({
                "success": False,
                "error": "Gemini API key is not configured."
            }), 500

        # Language names for better translation instructions
        language_names = {
            "en": "English",
            "hi": "Hindi",
            "te": "Telugu",
            "ta": "Tamil",
            "kn": "Kannada",
            "ml": "Malayalam",
            "fr": "French",
            "de": "German",
            "es": "Spanish",
            "it": "Italian",
            "pt": "Portuguese",
            "ru": "Russian",
            "ja": "Japanese",
            "ko": "Korean",
            "zh-CN": "Chinese",
            "ar": "Arabic"
        }

        target_name = language_names.get(
            target_language,
            target_language
        )

        if source_language == "auto":
            source_instruction = (
                "Automatically detect the source language."
            )
        else:
            source_name = language_names.get(
                source_language,
                source_language
            )
            source_instruction = (
                f"The source language is {source_name}."
            )

        # Translation prompt
        prompt = f"""
You are a professional language translation engine.

Translate the following text into {target_name}.

{source_instruction}

IMPORTANT RULES:
1. Return ONLY the translated text.
2. Do not explain the translation.
3. Do not add quotation marks.
4. Preserve the original meaning.
5. Preserve paragraphs and line breaks where possible.
6. Do not add extra information.

Text to translate:
{text}
"""

        # Gemini request
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 2000
            }
        }

        response = requests.post(
            GEMINI_URL,
            headers={
                "x-goog-api-key": GEMINI_API_KEY,
                "Content-Type": "application/json"
            },
            json=payload,
            timeout=30
        )

        result = response.json()

        # Handle Gemini API errors
        if response.status_code != 200:
            error_message = result.get(
                "error",
                {}
            ).get(
                "message",
                "Translation failed."
            )

            return jsonify({
                "success": False,
                "error": error_message
            }), response.status_code

        # Extract Gemini response
        candidates = result.get("candidates", [])

        if not candidates:
            return jsonify({
                "success": False,
                "error": "Gemini did not return a translation."
            }), 500

        parts = candidates[0].get("content", {}).get("parts", [])

        if not parts:
            return jsonify({
                "success": False,
                "error": "No translated text was returned."
            }), 500

        translated_text = parts[0].get("text", "").strip()

        if not translated_text:
            return jsonify({
                "success": False,
                "error": "Translation result was empty."
            }), 500

        return jsonify({
            "success": True,
            "translated_text": translated_text
        })

    except requests.exceptions.Timeout:
        return jsonify({
            "success": False,
            "error": "Translation service timed out. Please try again."
        }), 504

    except requests.exceptions.RequestException:
        return jsonify({
            "success": False,
            "error": "Could not connect to the Gemini API."
        }), 500

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)