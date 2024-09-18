import "../style.css";

interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface Phonetic {
  text?: string;
  audio?: string;
}

interface DictionaryAPIResponse {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  origin?: string;
  meanings: Meaning[];
}

const dictionaryAPI = "https://api.dictionaryapi.dev/api/v2/entries/en_US/";

const searchWord = async (word: string): Promise<DictionaryAPIResponse[]> => {
  try {
    const response = await fetch(`${dictionaryAPI}${word}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: DictionaryAPIResponse[] = await response.json();
    return data;
  } catch (error) {
    throw error; // Re-throw the error
  }
};

const extractWordDefinitions = (
  data: DictionaryAPIResponse[] | undefined
): Meaning[] | undefined => {
  return data?.[0]?.meanings ?? undefined;
};

const extractWordPhonetics = (
  data: DictionaryAPIResponse[] | undefined
): Phonetic[] | undefined => {
  return data?.[0]?.phonetics ?? undefined;
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

const displayWordDefinition = (meanings: Meaning[] | undefined): void => {
  const definitionsSection = document.getElementById(
    "definitions"
  ) as HTMLElement;
  definitionsSection.innerHTML = ""; // Clear previous content

  const definitionsHeading = `<h1 class="text-2xl font-semibold">Definitions</h1>`;
  definitionsSection.innerHTML += definitionsHeading;

  meanings?.forEach((meaning: Meaning) => {
    const definitionItems = meaning.definitions
      .map((def) => `<li>${def.definition}</li>`)
      .join("");
    const definitionBlock = `
      <div class="bg-sky-50">
        <p class="px-4 py-2 font-semibold text-white bg-sky-600">${meaning.partOfSpeech}</p>
        <ul class="p-2 ml-6 font-light list-disc text-sky-700">${definitionItems}</ul>
      </div>
    `;
    definitionsSection.innerHTML += definitionBlock;
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

const displayWordPhonetic = (phonetics: Phonetic[] | undefined): void => {
  const phoneticsSection = document.getElementById("phonetics") as HTMLElement;
  phoneticsSection.innerHTML = ""; // Clear previous content
  phoneticsSection.classList.add("flex", "flex-col", "gap-4");

  const phoneticsHeading = `<h1 class="text-2xl font-semibold">Phonetics</h1>`;
  phoneticsSection.innerHTML += phoneticsHeading;

  phonetics?.forEach((phonetic: Phonetic) => {
    if (!phonetic.text || !phonetic.audio) return;

    const phoneticBlock = `
      <div class="bg-stone-100">
        <p class="px-4 py-3 text-white bg-stone-700">${phonetic.text}</p>
        <audio style="width: 100%" controls>
          <source src="${phonetic.audio}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </div>
    `;
    phoneticsSection.innerHTML += phoneticBlock;
  });
};

// Event listener for search
const inputWord = document.getElementById("input") as HTMLInputElement;
const submitBtn = document.getElementById("submit") as HTMLButtonElement;

submitBtn.addEventListener("click", async (event: Event) => {
  event.preventDefault();
  const word: string = inputWord.value.trim();
  if (!word) return;

  try {
    const data = await searchWord(word);
    const meanings = extractWordDefinitions(data);
    displayWordDefinition(meanings);

    const phonetics = extractWordPhonetics(data);
    displayWordPhonetic(phonetics);
  } catch (error) {
    console.error("Error: ", error);
  }
});

// Initial content (can be removed or modified as needed)
const app = document.getElementById("app");
app.innerHTML = `<div>Hello World!</div>`;