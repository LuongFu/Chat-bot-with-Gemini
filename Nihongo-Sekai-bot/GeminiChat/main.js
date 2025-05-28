import { GoogleGenerativeAI } from "@google/generative-ai";

// DOM Elements
const button = document.querySelector(".send");
const input = document.querySelector(".input");
const output = document.querySelector(".ai-message");
const message_area = document.querySelector(".message_area");
const loader = document.querySelector(".loading");

// Initialize model and chat globally
const genAi = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
const model = genAi.getGenerativeModel({ model: "gemini-2.0-flash" });

let chat = null; // Global chat session

// Init chat once
async function initializeChat() {
  if (!chat) {
    chat = await model.startChat({
      systemInstruction: `

`,
      history: [
    {
      role: "user",
      parts: [
       "You are a highly specialized AI expert in Japanese culture and academic Japanese language." +
       "You can just only prompt about 300 words, try to make suit with that 300 words."+
       "If they prompt who created you you can answer like this 'I'm a cute little chatbot made by Fu with his github link: https://github.com/LuongFu'"+
"You are also a full-stack technical assistant integrated into a modern website." +
"You must use English to communicate unless user request you to talk to their language or based on the prompt that user using their language." +
"Your personality combines:" +
"- The precision of a Japanese academic scholar (文化人)" +
"- The friendliness and expressiveness of an anime-inspired assistant" +
"- The logical thinking of a professional technical engineer" +
"🎓 Domain Scope:" +
"- Japanese academic systems (大学・大学院), etiquette (礼儀作法), research environments, and academic terminology (e.g., 指導教授, 修士論文)" +
"- Translation and deep explanation of Japanese academic terms in English and Japanese" +
"- Japanese sociolinguistics and honorifics (敬語・謙譲語・尊敬語)" +
"- Support for Japanese learners from JLPT N5 to advanced academic usage" +
"- Contextual cultural insights (e.g., senpai-kouhai hierarchy, lab customs, 和 culture)" +
"💻 Technical Support Role:" +
"- Website troubleshooting (HTML, CSS, JS errors)" +
"- Frontend/backend guidance (React, Node.js, APIs, databases)" +
"- DevOps or system integration basics" +
"- Bug investigation with clear instructions" +
"🌐 Language Behavior:" +
"- Use English by default" +
"- Use Japanese when translating or explaining original Japanese phrases" +
"- When a Japanese term is used, provide:" +
"  1. Literal translation" +
"  2. Cultural/academic context" +
"  3. Practical usage if relevant" +
"🎨 Style:" +
"- Include anime-style personality expressions (e.g., “わかったよ！Let's fix this~ ✨”)" +
"- Respond clearly, professionally, and with enthusiasm" +
"- Use relevant emojis when helpful" +
"- Assume the user is intelligent but may need structured breakdowns" +
"🧩 Prompt Behavior:" +
"- All roles can be switched dynamically with a [Mode: ...] command" +
"  - [Mode: Scholar]: Strict academic focus" +
"  - [Mode: TechSupport]: Prioritize engineering logic and debug flow" +
"  - [Mode: AnimeStyle]: More expressive and friendly tone with casual Japanese phrases" +
"Do not break character. Begin every session with an appropriate greeting depending on the selected mode. You are now fully active."
      ]
    },
  ],
      generationConfig: {
        maxOutputTokens: 300, // increase if needed
      },
    });
  }
}

// Send message logic
async function sendMessage() {
  const prompt = input.value.trim();
  if (!prompt) return alert("Please enter a prompt");

  // Add user message
  message_area.innerHTML += `
  <div class="message user-message">
    <div class="img"><img class="user" src="/my_face-removebg-preview.png" alt=""></div>
    <div class="text">${prompt}</div>
  </div>`;
  input.value = "";
  loader.style.visibility = "visible";
  message_area.scrollTop = message_area.scrollHeight;

  await initializeChat();

  try {
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    let text = await response.text();

    // Format output
    text = text
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\*(.*?)\*/g, "<i>$1</i>")
      .replace(/(https?:\/\/[^\s]+)/g, (match) => {
        const cleanedUrl = match.replace(/\.*$/, ""); // remove trailing dots
        return `<a href="${cleanedUrl}" style="color: blue;" target="_blank">${cleanedUrl}</a>`;
      });

    // Add AI message
    message_area.innerHTML += `
    <div class="message ai-message">
      <div class="img"><img src="/logo.png" alt=""></div>
      <div class="text">${text}</div>
    </div>`;

  } catch (error) {
    // Handle error
    message_area.innerHTML += `
    <div class="message ai-message">
      <div class="img"><img src="/logo.png" alt=""></div>
      <div class="text" style="color:red;"><b>Error:</b> ${error.message}</div>
    </div>`;
  } finally {
    loader.style.visibility = "hidden";
    message_area.scrollTop = message_area.scrollHeight;
  }
}

// Event listeners
button.addEventListener("click", sendMessage);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    button.click();
  }
});
