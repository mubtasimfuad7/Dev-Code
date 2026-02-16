import React, { useContext } from 'react'
import { onFolderOpenButtonClicked } from './ComponentController/file_drop_down.controller';
import { appContext } from '../appContext';

const FileDrowdown = () => {

    const { setFolderPath } = useContext(appContext);


    //handle folder selection button click event
    const handleClickOnFolderOpenButton = async (event) => {
        try {
            const folderHandle = await onFolderOpenButtonClicked();
            if (folderHandle) {
                setFolderPath(folderHandle);
            }
        } catch (e) {
            
        }
    }







  return (
    <div className="py-1 min-w-50 bg-gray-600">
      <button onClick={handleClickOnFolderOpenButton} className="p-2 hover:bg-gray-500 w-full cursor-pointer text-left">Open Folder</button>
    </div>
  );
}

export default FileDrowdown
