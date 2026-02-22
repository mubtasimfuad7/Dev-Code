import React, { useContext, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
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
    showModel,
    setShowModel,
    sessions,
    activeSessionId,
    createNewChat,
    switchChat,
    deleteChat,
  } = useContext(aiContext);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory, isThinking]);

  if (!showModel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#171717] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 bg-[#212121] px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${modelLoaded ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}
            ></div>
            <h2 className="text-lg font-semibold text-white">
              DevCode Assistant
            </h2>
          </div>
          <button
            onClick={() => setShowModel(false)}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {modelLoaded ? (
          <div className="flex flex-1 min-h-0">
            {/* Chat history sidebar */}
            <div className="w-56 shrink-0 border-r border-white/5 bg-[#1a1a1a] flex flex-col overflow-hidden">
              <button
                onClick={createNewChat}
                className="m-3 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white hover:bg-white/10 transition-all"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New chat
              </button>
              <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`group flex items-center gap-2 rounded-lg px-3 py-2.5 mb-0.5 cursor-pointer transition-all ${
                      session.id === activeSessionId
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                    }`}
                    onClick={() => switchChat(session.id)}
                  >
                    <span className="flex-1 truncate text-sm" title={session.title}>
                      {session.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all"
                      title="Delete chat"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Main chat area */}
            <div className="flex-1 flex flex-col min-w-0">
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto custom-scrollbar space-y-6 p-6 scroll-smooth"
            >
              {chatHistory
                .filter((m) => m.role !== "system")
                .map((m, i) => (
                  <div
                    key={i}
                    className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-lg ${
                        m.role === "user"
                          ? "bg-[#2f2f2f] text-white rounded-tr-none"
                          : "bg-[#212121] text-gray-200 border border-white/5 rounded-tl-none"
                      }`}
                    >
                      <div className="mb-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                        {m.role === "user" ? "User" : "DevCode AI"}
                      </div>

                      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-transparent prose-pre:p-0">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }) {
                              const match = /language-(\w+)/.exec(
                                className || "",
                              );
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  className="my-3 rounded-lg border border-white/10 !bg-[#0d0d0d]"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              ) : (
                                <code
                                  className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300 font-mono text-xs"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-[#212121] border border-white/5 text-gray-400 text-xs px-4 py-2 rounded-full animate-pulse">
                    DevCode is thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-white/5 bg-[#171717] p-6 shrink-0">
              <form
                onSubmit={handleSend}
                className="relative flex items-end gap-2 rounded-xl border border-white/10 bg-[#212121] p-2 focus-within:border-blue-500/50 transition-all shadow-inner"
              >
                <textarea
                  className="max-h-40 w-full resize-none border-none bg-transparent p-3 text-white focus:ring-0 text-sm md:text-base outline-none"
                  rows="1"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder="Ask a coding question..."
                  disabled={isThinking}
                />
                <button
                  type="submit"
                  disabled={isThinking || !input.trim()}
                  className={`mb-1 mr-1 flex h-10 w-10 items-center justify-center rounded-lg transition-all
                    ${
                      !input.trim() || isThinking
                        ? "bg-white/5 text-gray-600"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                >
                  {isThinking ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="h-5 w-5"
                    >
                      <path
                        d="M7 11L12 6L17 11M12 18V7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </form>
            </div>
            </div>
          </div>
        ) : (
          /* Professional Loading Screen */
          <div className="flex flex-1 flex-col items-center justify-center space-y-6 bg-[#171717]">
            <div className="relative flex items-center justify-center">
              <div className="absolute h-16 w-16 animate-ping rounded-full bg-blue-500/20"></div>
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-white">
                Waking up DevCode
              </h3>
              <p className="text-xs text-gray-500 mt-1 font-mono">
                {modelStatus}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiModel;
