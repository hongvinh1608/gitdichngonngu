const selectTags = document.querySelectorAll('select');

selectTags.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id === 0 ? (country_code === "en" ? "selected" : "") : (country_code === "es" ? "selected" : "");

        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

document.getElementById('translateBtn').addEventListener('click', async function () {
    const inputText = document.getElementById('inputText').value;
    const translateFrom = document.getElementById('translateForm').value;
    const translateTo = document.getElementById('translateTo').value;

    try {
        const translatedText = await translateText(inputText, translateFrom, translateTo);
        document.getElementById('outputText').textContent = removeQuestionMarks(translatedText);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('outputText').textContent = "Error: An error occurred while translating!";
    }
});

async function translateText(inputText, fromLang, toLang) {
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${fromLang}|${toLang}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.responseData) {
        return data.responseData.translatedText;
    } else {
        throw new Error("Translation failed");
    }
}

function removeQuestionMarks(text) {
    return text.replace(/^¿+|¿+$/g, '');
}

function speakText(text) {
    const speechSynthesis = window.speechSynthesis;
    const speechUtterance = new SpeechSynthesisUtterance(text);
    speechUtterance.lang = document.getElementById('translateTo').value;

    speechSynthesis.speak(speechUtterance);
}

document.getElementById('speakBtn').addEventListener('click', function () {
    const translatedText = document.getElementById('outputText').textContent;
    speakText(translatedText);
});
