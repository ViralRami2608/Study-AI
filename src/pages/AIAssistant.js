import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

const CHAT_API_URL = "http://localhost:5000/api/ai/chat";
const CONVERSATION_API_URL = "http://localhost:5000/api/ai-conversations";

function AIAssistant() {
const [question, setQuestion] = useState("");
const [conversations, setConversations] = useState([]);
const [loading, setLoading] = useState(false);

const conversationsEndRef = useRef(null);

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

    const response = await fetch(CONVERSATION_API_URL, {
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

useEffect(() => {
  conversationsEndRef.current?.scrollIntoView({
    behavior: "auto",
    block: "end"
  });
}, [conversations]);

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

const temporaryId = `temp-${Date.now()}`;

// =========================================
// SHOW USER MESSAGE IMMEDIATELY
// =========================================

setQuestion("");

setConversations((previousConversations) => [
  ...previousConversations,
  {
    _id: temporaryId,
    question: trimmedQuestion,
    response: "",
    temporary: true
  }
]);

setLoading(true);

try {
  // =========================================
  // SEND QUESTION TO GEMINI
  // =========================================

  const response = await fetch(CHAT_API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },

    body: JSON.stringify({
      message: trimmedQuestion
    })
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.message ||
      "Failed to get AI response."
    );
  }

  if (!response.body) {
    throw new Error(
      "AI response stream is not available."
    );
  }

  // =========================================
  // READ STREAM
  // =========================================

  const reader = response.body.getReader();

  const decoder = new TextDecoder();

  let aiResponse = "";

  // =========================================
  // ADD AI MESSAGE IMMEDIATELY
  // =========================================

  setConversations((previousConversations) => [
    ...previousConversations,
    {
      _id: `${temporaryId}-ai`,
      question: "",
      response: "",
      isLoading: true
    }
  ]);

  // =========================================
  // RECEIVE AI RESPONSE
  // =========================================

  while (true) {
    const { value, done } =
      await reader.read();

    if (done) {
      break;
    }

    const chunk = decoder.decode(value, {
      stream: true
    });

    aiResponse += chunk;

    // =========================================
    // UPDATE AI MESSAGE LIVE
    // =========================================

    setConversations(
      (previousConversations) => {
        return previousConversations.map(
          (conversation) => {
            if (
              conversation._id ===
              `${temporaryId}-ai`
            ) {
              return {
                ...conversation,
                response: aiResponse,
                isLoading: false
              };
            }

            return conversation;
          }
        );
      }
    );
  }

  // =========================================
  // SAVE COMPLETED CONVERSATION
  // =========================================

  const saveResponse = await fetch(
    CONVERSATION_API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },

      body: JSON.stringify({
        question: trimmedQuestion,
        response: aiResponse
      })
    }
  );

  const saveData =
    await saveResponse.json();

  if (!saveResponse.ok) {
    throw new Error(
      saveData.message ||
      "Failed to save conversation."
    );
  }

  // =========================================
  // REPLACE TEMPORARY MESSAGES
  // =========================================

  setConversations(
    (previousConversations) => {
      const filtered =
        previousConversations.filter(
          (conversation) =>
            conversation._id !==
              temporaryId &&
            conversation._id !==
              `${temporaryId}-ai`
        );

      return [
        ...filtered,
        saveData.conversation
      ];
    }
  );

} catch (error) {
  console.log(
    "Send AI Conversation Error:",
    error.message
  );

  // =========================================
  // REMOVE TEMPORARY MESSAGES
  // =========================================

  setConversations(
    (previousConversations) =>
      previousConversations.filter(
        (conversation) =>
          conversation._id !==
            temporaryId &&
          conversation._id !==
            `${temporaryId}-ai`
      )
  );

} finally {
  setLoading(false);
}

};

// =========================================
// ENTER KEY
// =========================================

const handleKeyDown = (event) => {
if (
event.key === "Enter" &&
!event.shiftKey
) {
event.preventDefault();

  handleSend();
}

};

return ( <main className="ai-page">

```
  {/* PAGE HEADER */}

  <div className="ai-page-header">

    <h1>
      AI Study Assistant
    </h1>

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

        {conversations.map(
          (conversation) => (

            <div
              className="ai-conversation"
              key={conversation._id}
            >

              {/* USER MESSAGE */}

              {conversation.question && (

                <div className="ai-message-row ai-user-row">

                  <div className="ai-user-message">

                    <p>
                      {conversation.question}
                    </p>

                  </div>

                </div>

              )}


              {/* AI MESSAGE */}

              {conversation.question && (

                <div className="ai-message-row ai-ai-row">

                  <div className="ai-icon">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >

                      <path d="M12 6V2H8" />
                      <path d="M15 11v2" />
                      <path d="M2 12h2" />
                      <path d="M20 12h2" />
                      <path d="M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
                      <path d="M9 11v2" />

                    </svg>

                  </div>


                  <div className="ai-ai-message">

                    <strong>
                      AI Assistant
                    </strong>

                    <div className="ai-response">

                      {conversation.isLoading &&
                      !conversation.response ? (

                        <p>
                          Thinking...
                        </p>

                      ) : (

                        <ReactMarkdown>
                          {conversation.response}
                        </ReactMarkdown>

                      )}

                    </div>

                  </div>

                </div>

              )}

              {/* STREAMING AI MESSAGE */}

              {!conversation.question &&
                conversation.isLoading && (

                  <div className="ai-message-row ai-ai-row">

                    <div className="ai-icon">

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >

                        <path d="M12 6V2H8" />
                        <path d="M15 11v2" />
                        <path d="M2 12h2" />
                        <path d="M20 12h2" />
                        <path d="M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
                        <path d="M9 11v2" />

                      </svg>

                    </div>


                    <div className="ai-ai-message">

                      <strong>
                        AI Assistant
                      </strong>

                      <div className="ai-response">

                        {conversation.response ? (

                          <ReactMarkdown>
                            {conversation.response}
                          </ReactMarkdown>

                        ) : (

                          <p>
                            Thinking...
                          </p>

                        )}

                      </div>

                    </div>

                  </div>

                )}

            </div>

          )
        )}

        <div ref={conversationsEndRef} />

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

        {loading
          ? "Thinking..."
          : "Send"}

      </button>

    </div>

  </section>

</main>

);
}

export default AIAssistant;
