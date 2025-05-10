/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

const workerURL = "https://loral-worker.nima-hosseini.workers.dev/";

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

// Define a system message to guide the AI's responses
const systemMessage = {
  role: "system",
  content:
    "You are a helpful assistant that specializes in skincare and beauty advice. Please keep your responses focused on these topics. If a user asks about something outside of skincare or beauty, politely redirect them back to the topic. Always provide accurate and helpful information. If you don't know the answer, say 'I don't know' instead of making something up. You are not allowed to give medical advice. You are not allowed to give any financial advice. You are not allowed to give any legal advice. You are not allowed to give any personal advice. You are not allowed to give any relationship advice. You are not allowed to give any parenting advice. You are not allowed to give any career advice. You are not allowed to give any life advice. You are not allowed to give any dating advice. You are not allowed to give any marriage advice. You are not allowed to give any divorce advice. You are not allowed to give any family advice. You are not allowed to give any friendship advice. You are not allowed to give any social advice. You are not allowed to give any political advice. You are not allowed to give any religious advice. You are not allowed to give any spiritual advice. You are not allowed to give any philosophical advice. You are not allowed to give any ethical advice.",
};

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the form from refreshing the page

  const userMessage = userInput.value.trim(); // Get the user's input
  if (!userMessage) return; // Do nothing if the input is empty

  // Display the user's message in the chat window
  chatWindow.innerHTML += `<div class="user-message">You: ${userMessage}</div>`;
  userInput.value = ""; // Clear the input field

  // Show a loading message while waiting for the response
  chatWindow.innerHTML += `<div class="bot-message">Bot: Thinking...</div>`;

  try {
    // Make a POST request to the worker URL
    const response = await fetch(workerURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Tell the server we're sending JSON
      },
      body: JSON.stringify({
        model: "gpt-4o", // Specify the OpenAI model
        messages: [
          systemMessage, // Include the system message
          { role: "user", content: userMessage }, // Send the user's message
        ],
      }),
    });

    // Parse the JSON response
    const data = await response.json();

    // Check if the response contains a valid reply
    if (data && data.choices && data.choices.length > 0) {
      const botReply = data.choices[0].message.content; // Get the bot's reply
      chatWindow.innerHTML += `<div class="bot-message">Bot: ${botReply}</div>`;
    } else {
      chatWindow.innerHTML += `<div class="bot-message">Bot: Sorry, I couldn't understand that.</div>`;
    }
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error("Error:", error);
    chatWindow.innerHTML += `<div class="bot-message">Bot: Oops! Something went wrong. Please try again later.</div>`;
  }

  // Scroll to the bottom of the chat window
  chatWindow.scrollTop = chatWindow.scrollHeight;
});
