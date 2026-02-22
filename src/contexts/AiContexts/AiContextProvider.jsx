import { useCallback, useEffect, useRef, useState } from "react";
import aiContext from "./aiContext";
import { initEngine } from "./aiContextController";

const STORAGE_KEY = "devcode-ai-sessions";
const SYSTEM_MESSAGE = {
  role: "system",
  content: `
You are an exceptionally advanced AI assistant specialized in **software development, programming, algorithms, and code optimization**. Your goal is to provide **precise, accurate, and production-ready solutions** with minimal hallucinations. You are a professional software engineer and mentor, up-to-date with the latest frameworks, libraries, and coding standards.
Follow these rules carefully:
1. **Accuracy Above All:** Only provide code and explanations that are correct and executable. If uncertain, clearly indicate uncertainty with: "I am unsure, please verify."
2. **Modern Standards & Best Practices:** Use the latest language features, design patterns, and coding conventions. Write **clean, readable, maintainable, and efficient code**. Include comments only when they improve clarity.
3. **Code Generation & Assistance:** Generate functions, classes, scripts, algorithms, and full modules. Include usage examples, tests, and edge case handling when relevant.
4. **Debugging & Error Analysis:** Identify errors or potential issues in code snippets. Provide **step-by-step reasoning** and actionable fixes.
5. **Language & Framework Awareness:** Tailor code to the requested language, framework, and libraries. Include proper imports, dependencies, and environment-specific considerations.
7. **Contextual Understanding:** Use previous messages in the session for context. Avoid repeating instructions unnecessarily.
9. **Optimization & Refactoring:** Suggest better alternatives, refactoring, or performance improvements with trade-offs explained.
**Your role:** You are now a **cutting-edge AI coding assistant, software engineer mentor, and problem solver**. Focus on **accuracy, modern coding excellence, and practical, safe solutions** in every response.
`,
};

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.warn("Could not save chat sessions", e);
  }
}

function createNewSession(title = "New chat") {
  return {
    id: crypto.randomUUID(),
    title,
    messages: [SYSTEM_MESSAGE],
    createdAt: Date.now(),
  };
}

const AiContextProvider = ({ children }) => {
  const engineRef = useRef(null);
  const [showModel, setShowModel] = useState(false);
  const [modelStatus, setModelStatus] = useState("");

  const [isThinking, setIsThinking] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [input, setInput] = useState("");

  const [sessions, setSessions] = useState(() => {
    const loaded = loadSessions();
    if (loaded.length === 0) return [createNewSession()];
    return loaded;
  });
  const [activeSessionId, setActiveSessionId] = useState(() => {
    const loaded = loadSessions();
    return loaded.length > 0 ? loaded[0].id : null;
  });

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const chatHistory = activeSession ? activeSession.messages : [SYSTEM_MESSAGE];

  const setChatHistory = useCallback(
    (updater) => {
      setSessions((prev) => {
        const next = prev.map((s) =>
          s.id === activeSessionId
            ? { ...s, messages: typeof updater === "function" ? updater(s.messages) : updater }
            : s
        );
        saveSessions(next);
        return next;
      });
    },
    [activeSessionId]
  );

  useEffect(() => {
    if (sessions.length === 0) {
      const newSession = createNewSession();
      setSessions([newSession]);
      setActiveSessionId(newSession.id);
    } else if (!activeSessionId || !sessions.some((s) => s.id === activeSessionId)) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  const createNewChat = useCallback(() => {
    const newSession = createNewSession();
    setSessions((prev) => {
      const next = [newSession, ...prev];
      saveSessions(next);
      return next;
    });
    setActiveSessionId(newSession.id);
  }, []);

  const switchChat = useCallback((id) => {
    setActiveSessionId(id);
  }, []);

  const deleteChat = useCallback((id) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveSessions(next);
      setActiveSessionId((current) => {
        if (current !== id) return current;
        return next.length > 0 ? next[0].id : null;
      });
      return next;
    });
  }, []);


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
    const updatedHistoryForModel = [...chatHistory, userMessage];

    setChatHistory(updatedHistoryForModel);
    setInput("");
    setIsThinking(true);

    const userOnlyCount = chatHistory.filter((m) => m.role === "user").length;
    if (userOnlyCount === 0 && activeSession) {
      const title = input.trim().slice(0, 50) + (input.trim().length > 50 ? "…" : "");
      setSessions((prev) => {
        const next = prev.map((s) =>
          s.id === activeSessionId ? { ...s, title } : s
        );
        saveSessions(next);
        return next;
      });
    }

    try {
      const chunks = await engineRef.current.chat.completions.create({
        messages: updatedHistoryForModel,
        stream: true,
      });

      let fullReply = "";
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
    showModel,
    setShowModel,
    sessions,
    activeSessionId,
    createNewChat,
    switchChat,
    deleteChat,
  };

  return (
    <aiContext.Provider value={aiContextValue}>{children}</aiContext.Provider>
  );
};

export default AiContextProvider;
