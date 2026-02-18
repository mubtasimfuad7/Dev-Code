import { createContext, useEffect, useState } from "react";
import { buildFolderTree, buildFileSystemTree, mountWebContainer } from "./Controllers/context_controller";
import { appContext } from "./appContext";
import { WebContainer } from "@webcontainer/api";

export const AppContextProvider = ({ children }) => {
  //contains the current project path, 
  //this is set when from folder drop down open folder is clicked
  //and on its change webcontainer will be re-mounted, if not mounted previously
  //project side bar structure tree will be updated
  //monaco editor will also be updated
  const [folderPath, setFolderPath] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(null);

  //this is the folder tree strucuture created upon changing folder path(project)
  const [folderTree, setFolderTree] = useState(null);

  //webcontainr
  const [webContainer, setWebContainer] = useState(null);

  const createANewFolder = async(path_handle, folder_name)=>{
    try{
      //check if path handle and folder name exists
      if(!path_handle || !folder_name) return;

      const dup_folder_tree = {...folderTree};
      

    }catch(e){
      console.log("Error while creating a new folder")
    }
  }


  useEffect(() => {
    if (!folderPath || !webContainer) return;
    const handleOpeningFolder = async () => {
      const folder_tree = await buildFolderTree(folderPath, "", true);
      if (!folder_tree) {
        return;
      }
      console.log("folder path initial is: ", folderPath.name)
      const fs_tree = await buildFileSystemTree(folderPath);
      if (!fs_tree) return;
      setFolderTree(folder_tree);
      await mountWebContainer(fs_tree, webContainer,setWebContainer);

      console.log(fs_tree);
    }
    handleOpeningFolder();
  }, [folderPath]);


  useEffect(() => {
    const createWebContainer = async () => {
      try {
        if (!webContainer) {
          const webContainerInstance = await WebContainer.boot();
          setWebContainer(webContainerInstance);
        }
      } catch (e) {
        console.log("*****webcontainer error: ", e)
      }
    };
    createWebContainer();
  }, [])

  const context_value = {
    folderPath,
    folderTree,
    setFolderPath,
    webContainer, 
    setWebContainer,
    previewUrl, 
    setPreviewUrl,
  };
  return (
    <appContext.Provider value={context_value}>{children}</appContext.Provider>
  );
};
