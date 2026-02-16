import React, { useContext, useEffect, useState, useRef } from "react";
import { Editor, loader } from "@monaco-editor/react";
import { appContext } from "../../appContext";
import { monacoContext } from "../../contexts/monaco.context";

const MonacoEditorPane = () => {
  const { webContainer } = useContext(appContext);
  const { activeTab } = useContext(monacoContext);
  const [initialContent, setInitialContent] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const editorRef = useRef(null);

  const handleBeforeMount = (monaco) => {
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React, 
      reactNamespace: "React",
      allowJs: true,
    });
  };

  // 1. Fetch content from WebContainer when activeTab changes
  useEffect(() => {
    const loadFile = async () => {
      if (!activeTab?.path || !webContainer) return;

      setIsReading(true);
      try {
        const contents = await webContainer.fs.readFile(
          activeTab.path,
          "utf-8",
        );
        setInitialContent(contents);
      } catch (e) {
        console.error("FS Read Error:", e);
        setInitialContent("");
      } finally {
        setIsReading(false);
      }
    };
    loadFile();
  }, [activeTab?.path, webContainer]);

  // 2. Handle Saving
  const handleEditorChange = async (value) => {
    if (activeTab?.path && webContainer) {
      try {
        await webContainer.fs.writeFile(activeTab.path, value || "");
      } catch (e) {
        console.error("Save error:", e);
      }
    }
  };

  if (!activeTab) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#1e1e1e] text-gray-500">
        Select a file to start editing
      </div>
    );
  }
  if (isReading) return <div className="h-full w-full" />;

  const monacoPath = `file:///${activeTab.path.replace(/^\/+/, "")}`;

  return (
    <div className="h-full w-full">
      <Editor
        height="calc(100% - 40px)"
        theme="vs-dark"
        path={monacoPath}
        defaultValue={initialContent} // Uses this content if a new model is created
        beforeMount={handleBeforeMount}
        onMount={(editor) => (editorRef.current = editor)}
        onChange={handleEditorChange}
        options={{
          automaticLayout: true,
          minimap: { enabled: true },
          fontSize: 14,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default MonacoEditorPane;
