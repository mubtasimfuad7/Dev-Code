const getFileContent = async (handle) => {
    try {
        const file = await handle.getFile();

        const fileContent = await file.text();

        return fileContent;
    } catch (e) {
        console.log("Error Opening File", e)
    }
}

export {
    getFileContent
}