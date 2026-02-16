import { useContext, useEffect, useState } from "react";
import { monacoContext } from "./monaco.context";
import { Editor } from "@monaco-editor/react";
import { appContext } from "../appContext";
import { handleChangingActive } from "./monaco_context.controller";

export const EditorContextProvider = ({ children }) => {
  //contains all the opened file ref in tab
  const [openFiles, addToOpenFiles] = useState([]);
  //contains the editor map for the opended files in tab
  const [editorMap, addToEditorMap] = useState({});
  //editor reference
  const [editor, setEditor] = useState(null);
  //active tab
  const [activeTab, setActiveTab] = useState(null);

  const { webContainer } = useContext(appContext);

  
  useEffect(() => {
    handleChangingActive(
      activeTab,
      openFiles,
      addToOpenFiles,
      editorMap,
      addToEditorMap,
      webContainer,
    );
      const filePath = activeTab?.path;

    //   console.log("Editor map is: ", editorMap);
      console.log(filePath);
    
      if (editorMap[filePath]) {
        // console.log("editor map is fount")
          setEditor(editorMap[filePath]);
        }
  }, [activeTab]);
    
    useEffect(()=>{console.log(openFiles)},[openFiles])
    
    const monaco_context_values = {
        activeTab,
        setActiveTab, 
        editor, 
        openFiles
    };
  return (
    <monacoContext.Provider value={monaco_context_values}>
      {children}
    </monacoContext.Provider>
  );
};
