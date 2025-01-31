let prompt = document.querySelector("#prompt");
let submitbtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageinput = document.querySelector("#image input");

const SERVER_URL = "http://localhost:5000/api/chat"; // Backend URL

let user = { message: null };

// Predefined Q&A for common questions
const predefinedQuestions = {
  "what is react.js":
    "React.js is a JavaScript library for building user interfaces, primarily used for creating single-page applications.",
  "what is node.js":
    "Node.js is a runtime environment that allows you to run JavaScript on the server side, outside the browser.",
  "what is javascript":
    "JavaScript is a high-level, interpreted programming language that is used to create interactive effects within web browsers.",
  "what is python":
    "Python is a high-level, interpreted programming language known for its readability and wide usage in fields like web development, data analysis, and machine learning.",
  "what is html":
    "HTML (Hypertext Markup Language) is the standard language used to create and structure content on the web.",
};

// Load chat history from local storage
document.addEventListener("DOMContentLoaded", () => {
  let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.forEach((chat) => {
    let chatBox = createChatBox(chat.html, chat.classes);
    chatContainer.appendChild(chatBox);
    console.log(chatHistory);
  });
  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: "smooth",
  });
});

// Send message to the backend and display AI response
async function generateResponse(aiChatBox) {
  let text = aiChatBox.querySelector(".ai-chat-area");

  try {
    let response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: user.message }),
    });

    let data = await response.json();
    let apiResponse =
      data.choices?.[0]?.message?.content?.trim() ||
      "I'm sorry, I couldn't understand that.";
    text.innerHTML = apiResponse;

    saveChat(
      `<img src="ai.png" alt="" id="aiImage" width="10%"><div class="ai-chat-area">${apiResponse}</div>`,
      "ai-chat-box"
    );
  } catch (error) {
    console.error("Error:", error);
    text.innerHTML = "Error fetching response.";
  } finally {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });
  }
}

// Create chatbox elements
function createChatBox(html, classes) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

// Save chat history in local storage
function saveChat(html, classes) {
  let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.push({ html, classes });
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

// Handle chat input and display user message
function handlechatResponse(userMessage) {
  if (!userMessage.trim()) return;

  user.message = userMessage.toLowerCase(); // Convert message to lowercase for case-insensitive comparison

  // Check if the user message matches a predefined question
  if (predefinedQuestions[user.message]) {
    let html = `<img src="user.png" alt="" id="userImage" width="8%">
                 <div class="user-chat-area">${user.message}</div>`;
    prompt.value = "";
    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox);
    saveChat(html, "user-chat-box");

    // Display the predefined answer
    let aiHtml = `<img src="ai.png" alt="" id="aiImage" width="10%">
                  <div class="ai-chat-area">${
                    predefinedQuestions[user.message]
                  }</div>`;
    let aiChatBox = createChatBox(aiHtml, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);

    saveChat(aiHtml, "ai-chat-box");

    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });
  } else {
    // If no predefined answer, proceed with the regular AI response
    let html = `<img src="user.png" alt="" id="userImage" width="8%">
                <div class="user-chat-area">${user.message}</div>`;
    prompt.value = "";
    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox);
    saveChat(html, "user-chat-box");

    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });

    setTimeout(() => {
      let aiHtml = `<img src="ai.png" alt="" id="aiImage" width="10%">
                    <div class="ai-chat-area">
                    <img src="loading.webp" alt="" class="load" width="50px">
                    </div>`;
      let aiChatBox = createChatBox(aiHtml, "ai-chat-box");
      chatContainer.appendChild(aiChatBox);
      generateResponse(aiChatBox);
    }, 600);
  }
}

// Event listeners
prompt.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    handlechatResponse(prompt.value);
  }
});

submitbtn.addEventListener("click", () => {
  handlechatResponse(prompt.value);
});
