import "../style.css";

const dictionaryAPI = "https://api.dictionaryapi.dev/api/v2/entries/en_US/";

const searchWord = async (word) => {
  try {
    const response = await fetch(`${dictionaryAPI}${word}`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch data from the API");
  }
};

const extractWordDefinitions = (data) => {
  if (data && Array.isArray(data)) {
    if (data[0].meanings && Array.isArray(data[0].meanings)) {
      return data[0].meanings;
    }
  }
};

const extractWordPhonetics = (data) => {
  if (data && Array.isArray(data)) {
    if (data[0].phonetics && Array.isArray(data[0].phonetics)) {
      return data[0].phonetics;
    }
  }
};

// Helper functions for creating UI elements
const clearSection = (id) => {
  const section = document.getElementById(id);
  section.innerHTML = "";
  return section;
};

const createHeading = (text) => {
  const heading = document.createElement("h1");
  heading.classList.add("text-2xl", "font-semibold");
  heading.innerText = text;
  return heading;
};

// Functions for displaying definitions
const createDefinitionDiv = () => {
  const div = document.createElement("div");
  div.classList.add("bg-sky-50");
  return div;
};

const createPartOfSpeechElement = (partOfSpeech) => {
  const element = document.createElement("p");
  element.classList.add("px-4", "py-2", "font-semibold", "text-white", "bg-sky-600");
  element.innerText = partOfSpeech;
  return element;
};

const createDefinitionsList = () => {
  const list = document.createElement("ul");
  list.classList.add("p-2", "ml-6", "font-light", "list-disc", "text-sky-700");
  return list;
};

const createDefinitionItem = (definitionObj) => {
  const item = document.createElement("li");
  item.innerText = definitionObj.definition;
  return item;
};

const displayWordDefinition = (meanings) => {
  const definitionsSection = clearSection("definitions");
  definitionsSection.appendChild(createHeading("Definitions"));

  meanings.forEach((meaning) => {
    const definitionDiv = createDefinitionDiv();
    definitionsSection.appendChild(definitionDiv);

    const { partOfSpeech, definitions } = meaning;
    definitionDiv.appendChild(createPartOfSpeechElement(partOfSpeech));

    const definitionsList = createDefinitionsList();
    definitionDiv.appendChild(definitionsList);

    definitions.forEach((def) => {
      definitionsList.appendChild(createDefinitionItem(def));
    });
  });
};

// Functions for displaying phonetics
const createPhoneticsDiv = () => {
  const div = document.createElement("div");
  div.classList.add("bg-stone-100");
  return div;
};

const createPhoneticElement = (text) => {
  const element = document.createElement("p");
  element.classList.add("px-4", "py-3", "text-white", "bg-stone-700");
  element.innerText = text;
  return element;
};

const createAudioControl = (audio) => {
  const audioControl = document.createElement("audio");
  audioControl.style = "width: 100%";
  audioControl.setAttribute("controls", "true");
  
  const source = document.createElement("source");
  source.setAttribute("src", audio);
  source.setAttribute("type", "audio/mpeg");
  audioControl.appendChild(source);
  
  audioControl.appendChild(document.createTextNode(
    "Your browser does not support the audio element."
  ));
  
  return audioControl;
};

const displayWordPhonetic = (phonetics) => {
  const phoneticsSection = clearSection("phonetics");
  phoneticsSection.classList.add("flex", "flex-col", "gap-4");
  phoneticsSection.appendChild(createHeading("Phonetics"));

  phonetics.forEach((phonetic) => {
    const { text, audio } = phonetic;
    if (!text || !audio) return;

    const phoneticsDiv = createPhoneticsDiv();
    phoneticsSection.appendChild(phoneticsDiv);

    phoneticsDiv.appendChild(createPhoneticElement(text));
    phoneticsDiv.appendChild(createAudioControl(audio));
  });
};

// Event listener for search
const inputWord = document.getElementById("input");
const submitBtn = document.getElementById("submit");

submitBtn.addEventListener("click", (event) => {
  const word = inputWord.value.trim();
  if (!word) return;

  searchWord(word)
    .then((data) => {
      const meanings = extractWordDefinitions(data);
      displayWordDefinition(meanings);

      const phonetics = extractWordPhonetics(data);
      displayWordPhonetic(phonetics);
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
});

// Initial content (can be removed or modified as needed)
const app = document.getElementById("app");
app.innerHTML = `<div>Hello World!</div>`;