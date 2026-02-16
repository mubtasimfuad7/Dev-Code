import React, { useState, useEffect, useRef, useContext } from "react";
import * as webllm from "@mlc-ai/web-llm";
import aiContext from "../../contexts/AiContexts/aiContext";

const AiModel = () => {
  const {
    chatHistory,
    isThinking,
    modelStatus,
    modelLoaded,
    input,
    setInput,
    handleSend,
  } = useContext(aiContext);

  if (!modelLoaded) {
    return <div className="bg-red-500">
      <p>Is Loading</p>
      <p>{modelStatus}</p>
    </div>
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "20px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>DevCode Chat</h2>

      <div
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {chatHistory.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: "15px",
              textAlign: m.role === "user" ? "right" : "left",
            }}
          >
            <span style={{ fontWeight: "bold" }}>
              {m.role === "user" ? "You: " : "AI: "}
            </span>
            <div
              style={{
                display: "inline-block",
                padding: "8px",
                borderRadius: "8px",
                background: m.role === "user" ? "#007bff" : "#f1f1f1",
                color: m.role === "user" ? "white" : "black",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ display: "flex", gap: "10px" }}>
        <input
          style={{ flex: 1, padding: "10px" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isThinking}
        />
        <button
          type="submit"
          disabled={isThinking}
          style={{ padding: "10px 20px" }}
        >
          {isThinking ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default AiModel;
