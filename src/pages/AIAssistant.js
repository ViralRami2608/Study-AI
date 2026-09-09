import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/ai-conversations";

function AIAssistant() {
const [question, setQuestion] = useState("");
const [conversations, setConversations] = useState([]);
const [loading, setLoading] = useState(false);

// =========================================
// LOAD PREVIOUS CONVERSATIONS
// =========================================

useEffect(() => {
const fetchConversations = async () => {
try {
const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to load conversations.");
    }

    const data = await response.json();

    setConversations(data);
  } catch (error) {
    console.log(
      "Load AI Conversations Error:",
      error.message
    );
  }
};

fetchConversations();

}, []);

// =========================================
// SEND QUESTION
// =========================================

const handleSend = async () => {
const trimmedQuestion = question.trim();

if (!trimmedQuestion || loading) {
  return;
}

const token = localStorage.getItem("token");

if (!token) {
  return;
}

try {
  setLoading(true);

  // Temporary response
  // Real AI will be connected later.
  const aiResponse =
    "This is a temporary AI response. The real AI model will be connected next.";

  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },

    body: JSON.stringify({
      question: trimmedQuestion,
      response: aiResponse
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to save conversation."
    );
  }

  setConversations((previousConversations) => [
    ...previousConversations,
    data.conversation
  ]);

  setQuestion("");
} catch (error) {
  console.log(
    "Send AI Conversation Error:",
    error.message
  );
} finally {
  setLoading(false);
}

};

// =========================================
// ENTER KEY
// =========================================

const handleKeyDown = (event) => {
if (event.key === "Enter") {
handleSend();
}
};

return ( <main className="ai-page">

  {/* PAGE HEADER */}

  <div className="ai-page-header">
    <h1>AI Study Assistant</h1>

    <p>
      Get help with your studies and learning.
    </p>
  </div>


  {/* CHAT BOX */}

  <section className="ai-chat-box">

    {/* EMPTY CHAT */}

    {conversations.length === 0 && (
      <div className="ai-chat-content">

        <div className="ai-icon">
          AI
        </div>

        <h2>
          Start Your Study Conversation
        </h2>

        <p>
          Ask questions about your subjects,
          programming, assignments, or concepts.
        </p>

      </div>
    )}


    {/* CONVERSATION AREA */}

    {conversations.length > 0 && (
      <div className="ai-conversations">

        {conversations.map((conversation) => (
          <div
            className="ai-conversation"
            key={conversation._id}
          >

            {/* USER MESSAGE - RIGHT */}

            <div className="ai-message-row ai-user-row">

              <div className="ai-user-message">
                <p>
                  {conversation.question}
                </p>
              </div>

            </div>


            {/* AI MESSAGE - LEFT */}

            <div className="ai-message-row ai-ai-row">

              <div className="ai-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot-message-square"><path d="M12 6V2H8"/><path d="M15 11v2"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/><path d="M9 11v2"/></svg>
              </div>

              <div className="ai-ai-message">

                <strong>
                  AI Assistant
                </strong>

                <p>
                  {conversation.response}
                </p>

              </div>

            </div>

          </div>
        ))}

      </div>
    )}


    {/* INPUT AREA */}

    <div className="ai-input-area">

      <input
        type="text"
        value={question}
        onChange={(event) => {
          setQuestion(event.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Ask your study question..."
        disabled={loading}
      />

      <button
        type="button"
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send"}
      </button>

    </div>

  </section>

</main>

);
}

export default AIAssistant;
