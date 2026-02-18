const buildFolderTree = async (handle, parent = "", isRoot = false) => {
  try {
    if (!handle) return;
        const currentPath = isRoot ? "" : `${parent}/${handle.name}`;
        console.log(currentPath || "");
        const node = {
          name: handle.name,
          kind: handle.kind,
          path: currentPath || "", // root path is "/"
          children: [],
          handle,
        };

      if (handle.kind === "directory") {
          for await (const entry of handle.values()) {
            if(entry && entry.name === 'node_modules') continue;
            node.children.push(await buildFolderTree(entry, node.path));
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
};

const buildFileSystemTree = async (dirHandle) => {
  const tree = {};

  // 1. Iterate through all entries in the folder
  for await (const entry of dirHandle.values()) {
    // 2. Security/Performance: Skip massive or hidden folders
    if (entry.name === "node_modules" || entry.name === ".git") {
      continue;
    }

    if (entry.kind === "file") {
      // 3. Read file content as text (or use .arrayBuffer() for binary)
      const file = await entry.getFile();
      const contents = await file.text();


      tree[entry.name] = {
        file: { contents },
      };
    } else if (entry.kind === "directory") {
      // 4. Recurse into subdirectories
      tree[entry.name] = {
        directory: await buildFileSystemTree(entry),
      };
    }
  }

  return tree;
};


const mountWebContainer = async (fs_tree, webContainer, setWebContainer) => {
  try {
    if (!webContainer) {
      console.error("WebContainer not initialized.");
      return;
    }

    // 1. Read the root directory to see what's currently there
    const rootItems = await webContainer.fs.readdir('/', { withFileTypes: true });

    if (rootItems.length > 0) {
      console.log("Cleaning existing files in WebContainer...");
      
      // 2. Remove each top-level file/folder recursively
      // Use Promise.all to delete items in parallel for speed
      await Promise.all(
        rootItems.map((item) => 
          webContainer.fs.rm(item.name, { recursive: true, force: true })
        )
      );
    }

    // 3. Mount the new filesystem tree
    console.log("Mounting new project structure...");
    await webContainer.mount(fs_tree);

    console.log(await webContainer.fs.readdir("/", { withFileTypes: true }));


    // Optional: Update your React state if needed
    // setWebContainer(webContainer); 

    console.log("Mounting complete.");
  } catch (e) {
    console.error("Error while Booting/Mounting WebContainer:", e);
  }
};


const createNewFolder = async (folderHandle, webContainer, path, foldername) => {
  try {
    //check if the folder handle and webcontainer exists or not 
    //if does not exists then we can move further
    if (!folderHandle || !webContainer) return;

    //create a new folder inside the given folderHandle 
    //which will make a new folder inside the given handle in the local filesystem(os)
    const newFolderHandle = await folderHandle.getDirectoryHandle(foldername, { create: true });

    //if the file is created successfully then proccedd
    //this folder or file creation may fail if the foldername is a duplicate folder name inside the folder path
    if (newFolderHandle) {
      //construct the new folder/file path by appending the folder name
      const fullPath = path ? `${path}/${foldername}` : foldername;

      //
      await remountWebcontainer(webContainer, fullPath);

      console.log(`Folder created at: ${fullPath}`);

      return newFolderHandle;
    }
  } catch (e) {
    console.error("Error while creating the new folder:", e);
  }
};

const remountWebcontainer = async (webContainer, fs_path) => {
  try {
    if (!webContainer || !fs_path) return;

    await webContainer.fs.mkdir(fs_path, { recursive: true });
    
    console.log(`Path synced to WebContainer: ${fs_path}`);
  } catch (e) {
    console.error("Error while syncing path to webcontainer:", e);
  }
};

export { buildFolderTree, buildFileSystemTree, mountWebContainer };
