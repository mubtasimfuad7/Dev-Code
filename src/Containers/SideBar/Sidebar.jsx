import React, { useContext } from 'react'
import { appContext } from '../../appContext'
import FolderTree from './FolderTree';

const Sidebar = () => {

  const { folderTree } = useContext(appContext);
  return (
    <div className="sidebar_container pr-2 bg-[#252526] h-full resize-x  flex-1 overflow-y-scroll custom-scrollbar">
      {folderTree ? (
        <div className="directory_tree">
          <FolderTree handle={folderTree}></FolderTree>
        </div>
      ) : (
        <div className="">
          <p>No Folder is Choosen</p>
        </div>
      )}
    </div>
  );
}

export default Sidebar
