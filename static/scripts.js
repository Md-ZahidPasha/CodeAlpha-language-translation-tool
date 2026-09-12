const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");

const translateButton = document.getElementById("translateButton");
const copyButton = document.getElementById("copyButton");
const clearButton = document.getElementById("clearButton");
const swapButton = document.getElementById("swapButton");

const speakButton = document.getElementById("speakButton");
const stopButton = document.getElementById("stopButton");

const characterCount = document.getElementById("characterCount");
const statusMessage = document.getElementById("statusMessage");


// Character counter
inputText.addEventListener("input", () => {
    characterCount.textContent = `${inputText.value.length} / 5000`;
});


// Translate button
translateButton.addEventListener("click", async () => {

    const text = inputText.value.trim();

    if (!text) {
        statusMessage.textContent = "Please enter some text.";
        return;
    }

    translateButton.disabled = true;
    translateButton.textContent = "Translating...";
    statusMessage.textContent = "Processing...";
    outputText.value = "";

    try {

        const response = await fetch("/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                source_language: sourceLanguage.value,
                target_language: targetLanguage.value
            })
        });

        const data = await response.json();

        if (data.success) {
            outputText.value = data.translated_text;
            statusMessage.textContent = "Translation completed.";
        } else {
            statusMessage.textContent = data.error || "Translation failed.";
        }

    } catch (error) {

        statusMessage.textContent =
            "Unable to connect to the server.";

        console.error(error);

    } finally {

        translateButton.disabled = false;
        translateButton.textContent = "Translate";
    }
});


// Copy translated text
copyButton.addEventListener("click", async () => {

    const translatedText = outputText.value;

    if (!translatedText) {
        statusMessage.textContent = "Nothing to copy.";
        return;
    }

    try {

        await navigator.clipboard.writeText(translatedText);

        statusMessage.textContent = "Copied to clipboard.";

    } catch (error) {

        statusMessage.textContent = "Copy failed.";
    }
});


// Clear input and output
clearButton.addEventListener("click", () => {

    inputText.value = "";
    outputText.value = "";

    characterCount.textContent = "0 / 5000";
    statusMessage.textContent = "";
});


// Swap languages
swapButton.addEventListener("click", () => {

    if (sourceLanguage.value === "auto") {
        statusMessage.textContent =
            "Select a source language before swapping.";
        return;
    }

    const temporaryLanguage = sourceLanguage.value;

    sourceLanguage.value = targetLanguage.value;
    targetLanguage.value = temporaryLanguage;

    // Swap text as well
    const temporaryText = inputText.value;

    inputText.value = outputText.value;
    outputText.value = temporaryText;

    characterCount.textContent =
        `${inputText.value.length} / 5000`;
});
// Text-to-Speech
speakButton.addEventListener("click", () => {

    const text = outputText.value.trim();

    if (!text) {
        statusMessage.textContent = "Nothing to speak.";
        return;
    }

    // Stop any previous speech
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    // Set speech language according to selected target language
    const speechLanguages = {
        "en": "en-US",
        "hi": "hi-IN",
        "te": "te-IN",
        "ta": "ta-IN",
        "kn": "kn-IN",
        "ml": "ml-IN",
        "fr": "fr-FR",
        "de": "de-DE",
        "es": "es-ES",
        "it": "it-IT",
        "pt": "pt-PT",
        "ru": "ru-RU",
        "ja": "ja-JP",
        "ko": "ko-KR",
        "zh-CN": "zh-CN",
        "ar": "ar-SA"
    };

    speech.lang = speechLanguages[targetLanguage.value] || "en-US";

    speech.rate = 0.9;
    speech.pitch = 1;

    speech.onstart = () => {
        statusMessage.textContent = "🔊 Speaking...";
        speakButton.disabled = true;
        stopButton.disabled = false;
    };

    speech.onend = () => {
        statusMessage.textContent = "Speech completed.";
        speakButton.disabled = false;
        stopButton.disabled = true;
    };

    speech.onerror = () => {
        statusMessage.textContent = "Unable to play speech.";
        speakButton.disabled = false;
        stopButton.disabled = true;
    };

    window.speechSynthesis.speak(speech);
});


// Stop Text-to-Speech
stopButton.addEventListener("click", () => {

    window.speechSynthesis.cancel();

    statusMessage.textContent = "Speech stopped.";

    speakButton.disabled = false;
    stopButton.disabled = true;
});


// Initially disable Stop button
stopButton.disabled = true;