import React from "react";

function AIAssistant() {
  return (
    <main className="ai-page">

      {/* Page Header */}

      <div className="ai-page-header">
        <h1>AI Study Assistant</h1>

        <p>
          Get help with your studies and learning.
        </p>
      </div>


      {/* AI Chat Box */}

      <section className="ai-chat-box">

        {/* Welcome Area */}

        <div className="ai-chat-content">

          <div className="ai-icon">
            AI
          </div>

          <h2>
            Start Your Study Conversation
          </h2>

          <p>
            Ask questions about your subjects, programming,
            assignments, or concepts.
          </p>

        </div>


        {/* Input */}

        <div className="ai-input-area">

          <input
            type="text"
            placeholder="Ask your study question..."
          />

          <button type="button">
            Send
          </button>

        </div>

      </section>

    </main>
  );
}

export default AIAssistant;