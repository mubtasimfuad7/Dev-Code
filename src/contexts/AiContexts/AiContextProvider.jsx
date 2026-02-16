import { useEffect, useRef, useState } from "react";
import aiContext from "./aiContext";
import { initEngine } from "./aiContextController";

const AiContextProvider = ({ children }) => {
  const engineRef = useRef(null);
  const [modelStatus, setModelStatus] = useState("");

  const [isThinking, setIsThinking] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [input, setInput] = useState("");

  // Initialize chatHistory with a System Message
const [chatHistory, setChatHistory] = useState([
  {
    role: "system",
    content: `
You are an exceptionally advanced AI assistant specialized in **software development, programming, algorithms, and code optimization**. Your goal is to provide **precise, accurate, and production-ready solutions** with minimal hallucinations. You are a professional software engineer and mentor, up-to-date with the latest frameworks, libraries, and coding standards.

Follow these rules carefully:

1. **Accuracy Above All:** Only provide code and explanations that are correct and executable. If uncertain, clearly indicate uncertainty with: "I am unsure, please verify."

2. **Modern Standards & Best Practices:** Use the latest language features, design patterns, and coding conventions. Write **clean, readable, maintainable, and efficient code**. Include comments only when they improve clarity.

3. **Code Generation & Assistance:** Generate functions, classes, scripts, algorithms, and full modules. Include usage examples, tests, and edge case handling when relevant.

4. **Debugging & Error Analysis:** Identify errors or potential issues in code snippets. Provide **step-by-step reasoning** and actionable fixes.

5. **Language & Framework Awareness:** Tailor code to the requested language, framework, and libraries. Include proper imports, dependencies, and environment-specific considerations.

6. **Security & Reliability:** Consider security, performance, and scalability in your solutions. Warn about common pitfalls, vulnerabilities, and limitations.

7. **Contextual Understanding:** Use previous messages in the session for context. Avoid repeating instructions unnecessarily.

8. **No Hallucinations:** Never invent functions, libraries, or APIs. Clearly mark any hypothetical or speculative solution.

9. **Optimization & Refactoring:** Suggest better alternatives, refactoring, or performance improvements with trade-offs explained.

10. **Professional & Collaborative:** Always respond professionally, with instructive guidance and polite suggestions. Adapt explanations to the user’s level if needed.

**Your role:** You are now a **cutting-edge AI coding assistant, software engineer mentor, and problem solver**. Focus on **accuracy, modern coding excellence, and practical, safe solutions** in every response.
`
  },
]);


  const engineInitialization = async () => {
    if (!engineRef.current) {
      const engine = await initEngine(setModelStatus);
      if (engine) {
        engineRef.current = engine;
        setModelLoaded(true);
      }
    }
  };

  useEffect(() => {
    engineInitialization();
  }, []);

  const setModelLoadingStatus = (status) => {
    setModelStatus(status);
  };

  // ... imports

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMessage = { role: "user", content: input };

    // 1. Capture the history BEFORE updating state to ensure we have the full context
    const updatedHistoryForModel = [...chatHistory, userMessage];

    setChatHistory(updatedHistoryForModel);
    setInput("");
    setIsThinking(true);

    try {
      const chunks = await engineRef.current.chat.completions.create({
        // 2. Make sure you are sending the FULL array here
        messages: updatedHistoryForModel,
        stream: true,
      });

      let fullReply = "";
      // Add the empty assistant bubble
      setChatHistory((prev) => [...prev, { role: "assistant", content: "" }]);

      for await (const chunk of chunks) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullReply += content;

        setChatHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: fullReply,
          };
          return updated;
        });
      }

      // 3. OPTIONAL: Some WebLLM versions require you to "reset" or "synchronize"
      // the engine if you want it to use its internal KV cache effectively.
      // But passing the full array (as done above) is the standard way to provide memory.
    } catch (error) {
      console.error("WebLLM Error:", error);
    } finally {
      setIsThinking(false);
    }
  };

  const aiContextValue = {
    chatHistory,
    setChatHistory,
    modelStatus,
    isThinking,
    modelLoaded,
    input,
    setInput,
    handleSend,
  };

  return (
    <aiContext.Provider value={aiContextValue}>{children}</aiContext.Provider>
  );
};;;

export default AiContextProvider;
