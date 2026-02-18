import React, { useState, useEffect, useContext } from "react";
import FileIcon from "../../Elements/FileIcon";
import { appContext } from "../../appContext";
import { monacoContext } from "../../contexts/monaco.context";
import { MdCreateNewFolder, MdFileOpen, MdFolder, MdFolderOpen, MdNoteAdd } from "react-icons/md";

const FolderTree = ({ handle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [createNew, setCreateNew] = useState([0, 0]);

  const { setActiveTab } = useContext(monacoContext);

  const handleCreateNew = (e) => {
    try {
      e.preventDefault();
    } catch (e) {
      console.log("Error while creating new file or folder", e);
    }
  }

  const handleOnClick = (file) => {
    if (file.kind !== "directory") {
      setActiveTab(file);
    }
  };

  const isDirectory = handle.kind === "directory";

  // Toggle folder and fetch children if not already loaded
  const toggleFolder = async () => {
    if (!isDirectory) return;

    const nextState = !isOpen;
    setIsOpen(nextState);
  };

  return (
    <div style={{ userSelect: "none" }} className="w-full pl-[12px] ">
      <div
        onClick={toggleFolder}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: "2px 4px",
          hover: { backgroundColor: "#2a2d2e" }, // VS Code style
        }}

        className="w-full"
      >
        <span style={{ marginRight: "6px" }}>
          {isDirectory ? (
            isOpen ? (
              <MdFolder className="text-purple-400"></MdFolder>
            ) : (
              <MdFolderOpen className="text-purple-500"></MdFolderOpen>
            )
          ) : (
            <FileIcon filename={handle.name}></FileIcon>
          )}
        </span>
        <div
          title={handle.path}
          onClick={() => {
            handleOnClick(handle);
          }}
          className="group relative w-full flex items-center justify-between overflow-hidden whitespace-nowrap text-gray-300 font-semibold"
          style={{ fontSize: "14px", fontFamily: "Segoe UI, sans-serif" }}
        >
          {/* The visible, clipped name */}
          <span className="block truncate">{handle.name}</span>

          {/* The Hover Overlay: Only appears if the parent 'group' is hovered */}
          <span className="absolute left-0 top-0 hidden group-hover:block bg-[#2a2d2e] z-10 pr-2 shadow-lg">
            {handle.name}
          </span>

          {
            isDirectory && <div className="flex items-center gap-1 justify-end">
            <div title="Create a New Folder" className="w-5 h-5 p-0.5 hover:bg-gray-700 duration-300 hover:duration-300 rounded-sm" onClick={(e)=>{e.preventDefault(); setCreateNew([1, 0])}}>
              <MdCreateNewFolder className="w-full h-full aspect-square text-gray-500 "></MdCreateNewFolder>
            </div>
            <div title="Create a New File" className="w-5 h-5 p-0.5 hover:bg-gray-700 duration-300 hover:duration-300 rounded-sm" onClick={(e)=>{e.preventDefault(); setCreateNew([0, 1])}}>
              <MdNoteAdd className="w-full h-full aspect-square text-gray-500 "></MdNoteAdd>
            </div>
          </div>
          }
        </div>
      </div>

      {isOpen && (
        <div className="w-full" style={{ borderLeft: "1px solid #444", marginLeft: "7px" }}>
          {loading && (
            <div style={{ marginLeft: "20px", fontSize: "12px" }}>
              Loading...
            </div>
          )}
          {handle.children.map((childHandle) => (
            <div className="w-full ">
              {(createNew[0] || createNew[1]) == 1 ? <form className="b-1 w-full pl-[12px]" onSubmit={handleCreateNew}>
                <input style={{ fontFamily: "Segoe UI, sans-serif" }} className="w-full px-1 py-0.5 text-sm text-gray-300 font-semibold bg-gray-700 outline-none focus:outline-none" type="text" name="create_new" id="create_new" />
              </form> : <></>}
              <FolderTree key={childHandle.name} handle={childHandle} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderTree;
