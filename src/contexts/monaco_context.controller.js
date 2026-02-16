/*
Creates file path from handle
Checks if already opened
If not:
  - adds to open files
  - reads content from WebContainer FS
  - creates Monaco model
  - stores in editor map
*/

import { Editor } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

export const handleChangingActive = async (
  handle,
  openFiles,
  addToOpenFiles,
  editorMap,
  addToEditorMap,
  webContainer,
) => {
  try {
    if (!handle || !webContainer) {
      console.log("handle or webcontainer is not defined");
      return;
    }

    // Build file path safely
      const filePath = handle.path
      

    // Check if already opened
    const existsInOpenFiles = openFiles.some((file) => file.path === handle.path);

    if (!existsInOpenFiles) {
      addToOpenFiles(prev => ([...prev, handle]));

      // Read file from WebContainer FS
      console.log("Error breaking here");
        const contents = await webContainer.fs.readFile(filePath, "utf-8");


      // Avoid duplicate Monaco models
      if (!editorMap[filePath]) {
        // Detect language (basic)
        const extension = filePath.split(".").pop();
        const languageMap = {
          js: "javascript",
          ts: "typescript",
          cpp: "cpp",
          c: "c",
          py: "python",
          html: "html",
          css: "css",
          json: "json",
        };

          const language = languageMap[extension] || "plaintext";
          
          const monacoURIpath = `file:///${filePath.replace(/^\/+/, "")}`; 
          console.log('monaco path uri is: ', monacoURIpath);

          // Create Monaco model
        const model = monaco.editor.createModel(
          contents,
          language,
          monaco.Uri.parse(monacoURIpath),
        );

        // Store model
        addToEditorMap((prev) =>({...prev, [filePath]: model}));
      }
    }
  } catch (e) {
    console.log("Error while opening file:", e);
  }
};
