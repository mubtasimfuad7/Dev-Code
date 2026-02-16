import React, { useContext } from 'react'
import { appContext } from '../../appContext';
import EditorMenu from './EditorMenu';
import MonacoEditorPane from './MonacoEditorPane';

const EditorPane = () => {
  const { openFiles, setActiveFile, activeFile } = useContext(appContext);
  return (
    <div className="w-full h-full flex-1 resize-x bg-[#282c34]">
      <EditorMenu></EditorMenu>
      <MonacoEditorPane></MonacoEditorPane>
    </div>
  );
}

export default EditorPane
