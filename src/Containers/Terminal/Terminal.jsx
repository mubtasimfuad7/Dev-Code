import React, { useEffect, useRef, useContext } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { appContext } from "../../appContext";

const Terminal = () => {
  const terminalRef = useRef(null);
  const terminalInstance = useRef(null);
  const { webContainer, setPreviewUrl } = useContext(appContext);

  useEffect(() => {
    if (!webContainer || !terminalRef.current || terminalInstance.current)
      return;

    const term = new XTerm({
      cursorBlink: true,
      theme: {
        background: "#1e1e1e",
        foreground: "#ffffff",
      },
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    terminalInstance.current = term;

    // 2. Start the Shell
    startShell(term);

    // --- NEW: Listen for Server Ready ---
    // This catches when you run 'npm run dev' or any server process
    const serverReadyListener = webContainer.on("server-ready", (port, url) => {
      console.log(`Server is ready at port ${port}: ${url}`);
      setPreviewUrl(url); // Setting the URL in your context
    });

    // Handle window resize
    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      // Cleanup listener and terminal
      // Note: serverReadyListener returns an 'off' function in some versions,
      // but standard event cleanup is good practice.
      window.removeEventListener("resize", handleResize);
      term.dispose();
      terminalInstance.current = null;
    };
  }, [webContainer, setPreviewUrl]);

  async function startShell(term) {
    const shellProcess = await webContainer.spawn("jsh", {
      terminal: {
        cols: term.cols,
        rows: term.rows,
      },
    });

    shellProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          term.write(data);
        },
      }),
    );

    const input = shellProcess.input.getWriter();
    term.onData((data) => {
      input.write(data);
    });
  }

  return (
    <div className="h-full flex-1 bg-[#1e1e1e] overflow-hidden">
      <div ref={terminalRef} className="h-full w-full" />
    </div>
  );
};

export default Terminal;
