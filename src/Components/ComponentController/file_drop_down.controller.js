
const buildDirectoryTree = async (handle) => {
    try {
        const node = {
            name: handle.name, 
            kind: handle.kind, 
            children: [], 
            handle: handle
        }

        if (handle.kind === "directory") {
          for await (const entry of handle.values()) {
            node.children.push(await buildDirectoryTree(entry));
          }

          node.children.sort((a, b) => {
            if (a.kind === b.kind) return a.name.localeCompare(b.name);
            return a.kind === "directory" ? -1 : 1;
          });
        }

        return node;
    } catch (e) {
        console.log("Error while Creating Directory Tree", e);
    }
}


const onFolderOpenButtonClicked = async (event) => {
    try {

        //get the folder handle to be opened in the app
        const folderHandle = await window.showDirectoryPicker();

        //----dubug purpose log
        console.log(folderHandle);

        //check if the folder handle exists
        if (folderHandle) {
            //build the directory tree for the choosen directory
            return folderHandle;
        }

        return false;
        
    } catch (e) {
        console.log("Error while opening Folder Selection pane", e)
        return false;
    }
}


export {
    onFolderOpenButtonClicked
}