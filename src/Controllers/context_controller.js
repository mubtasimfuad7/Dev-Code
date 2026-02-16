const buildFolderTree = async (handle, parent = "", isRoot = false) => {
  try {
    if (!handle) return;
        const currentPath = isRoot ? "" : `${parent}/${handle.name}`;

        const node = {
          name: handle.name,
          kind: handle.kind,
          path: currentPath || "", // root path is "/"
          children: [],
          handle,
        };

      if (handle.kind === "directory") {
          for await (const entry of handle.values()) {
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

export { buildFolderTree, buildFileSystemTree, mountWebContainer };
