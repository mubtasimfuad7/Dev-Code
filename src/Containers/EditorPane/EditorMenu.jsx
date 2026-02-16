import React, { useContext, useEffect } from "react";
import { appContext } from "../../appContext";
import { MdClose } from "react-icons/md";
import FileIcon from "../../Elements/FileIcon";
import { monacoContext } from "../../contexts/monaco.context";

const EditorMenu = () => {
    const { openFiles, setActiveTab, activeTab } = useContext(monacoContext);
    
    useEffect(() => {
        
    }, [activeTab])
  return (
    <div className="editor_menu_container h-10 flex items-start gap-0.5 overflow-x-scroll no-scrollbar w-full bg-[#1e2023]">
      {openFiles?.map((file, index) => {
        return (
          <div
            onClick={() => setActiveTab(file)}
            // Use 'overflow-hidden' and 'shrink-0' to keep the tab size locked
            className={`min-w-40 max-w-40 w-40 shrink-0 group snap-start scroll-smooth flex items-center justify-between gap-2 text-gray-300 p-2 px-1 cursor-pointer border-r border-[#181a1d] ${
              activeTab.name === file.name ? "bg-[#1e1e1e]" : "bg-[#21252b]"
            }`}
            key={index}
          >
            {/* Wrap icon and text in a div that is forced to overflow-hidden */}
            <div className="flex items-center gap-1 overflow-hidden flex-1">
              <div className="shrink-0 flex w-5 h-5 items-center">
                <FileIcon filename={file.name} />
              </div>
              <p className="truncate text-sm font-medium select-none">
                {file.name}
              </p>
            </div>

            {/* Close Icon - Fixed size so it never moves */}
            <div className="shrink-0 w-5 h-5 flex items-center justify-center group-hover:opacity-100 opacity-0 hover:bg-gray-600 rounded-md transition-all duration-200">
              <MdClose className="w-4 h-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EditorMenu;
