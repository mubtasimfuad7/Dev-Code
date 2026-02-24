import React, { useState } from "react";
import MenuBar from "./Containers/MenuBar/MenuBar";
import Sidebar from "./Containers/SideBar/Sidebar";
import EditorPane from "./Containers/EditorPane/EditorPane";
import Terminal from "./Containers/Terminal/Terminal";
import ResizablePane from "./Components/ResizablePane";
import Preview from "./Containers/Preview/Preview";
import AiModel from "./Containers/AiModel/AiModel";

const App = () => {
  const [showPreview, setShowPreview] = useState(false);
  return (
    <div className="ide_container w-full h-screen overflow-y-hidden">
      <MenuBar setShowPreview={setShowPreview}></MenuBar>
      <Preview showPreview={showPreview} setShowPreview={setShowPreview}></Preview>
      <div className="flex relative justify-between w-full h-[calc(100%-30px)]">
      {/* <AiModel></AiModel> */}
        <ResizablePane>
          <Sidebar></Sidebar>
        </ResizablePane>
        <ResizablePane max_width={1000} initial_width={800}>
          <EditorPane></EditorPane>
        </ResizablePane>
        <Terminal></Terminal>
      </div>
    </div>
  );
};

export default App;
