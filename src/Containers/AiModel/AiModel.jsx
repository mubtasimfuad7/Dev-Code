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
      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#171717] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 bg-[#212121] px-6 py-4">
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
          <>
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
            <div className="border-t border-white/5 bg-[#171717] p-6">
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
          </>
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
