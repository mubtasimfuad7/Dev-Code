import React from "react";
import {
  VscJson,
  VscSourceControl,
  VscCode,
  VscSymbolFile,
  VscMarkdown,
  VscFilePdf,
  VscFileZip,
  VscFileMedia,
  VscSettingsGear,
  VscTypeHierarchy,
  VscSymbolColor,
  VscFileCode,
  VscFileSubmodule,
} from "react-icons/vsc";
import {
  DiJavascript1,
  DiPython,
  DiReact,
  DiCss3Full,
  DiHtml5,
} from "react-icons/di";
import { SiTypescript, SiCplusplus } from "react-icons/si";

const file_icon_map = {
  // Web Technologies (using colored dev-icons for better look)
  js: <DiJavascript1 style={{ color: "#f1e05a" }} />,
  jsx: <DiReact style={{ color: "#61dafb" }} />,
  ts: <SiTypescript style={{ color: "#3178c6" }} />,
  tsx: <DiReact style={{ color: "#3178c6" }} />,
  html: <DiHtml5 style={{ color: "#e34c26" }} />,
  css: <DiCss3Full style={{ color: "#563d7c" }} />,

  // Programming Languages
  py: <DiPython style={{ color: "#3572A5" }} />,
  cpp: <SiCplusplus style={{ color: "#f34b7d" }} />,
  c: <VscFileCode style={{ color: "#555555" }} />,

  // Config & Data
  json: <VscJson style={{ color: "#cbcb41" }} />,
  md: <VscMarkdown style={{ color: "#007acc" }} />,
  yml: <VscSettingsGear style={{ color: "#6d6d6d" }} />,
  yaml: <VscSettingsGear style={{ color: "#6d6d6d" }} />,

  // Media & Assets
  png: <VscFileMedia style={{ color: "#a074c4" }} />,
  jpg: <VscFileMedia style={{ color: "#a074c4" }} />,
  jpeg: <VscFileMedia style={{ color: "#a074c4" }} />,
  svg: <VscSymbolColor style={{ color: "#ff832b" }} />,

  // Others
  pdf: <VscFilePdf style={{ color: "#ce3939" }} />,
  zip: <VscFileZip style={{ color: "#ecbb40" }} />,
};

const FileIcon = ({ filename }) => {
  // 1. Exact Match Check (For files like 'package.json' or '.gitignore')
  const lowerName = filename?.toLowerCase() || "";

  if (lowerName === "package.json")
    return <VscJson style={{ color: "#e8274b" }} />;
  if (lowerName.includes("git"))
    return <VscSourceControl style={{ color: "#f34f29" }} />;

  // 2. Extension Check
  const parts = lowerName.split(".");
  const ext = parts.length > 1 ? parts.pop() : "";

  const icon = file_icon_map[ext] || (
    <VscSymbolFile className="w-full h-full" style={{ color: "#858585" }} />
  );

  return (
      <div
          className="w-full h-full flex items-center justify-center"
    >
      {icon}
    </div>
  );
};

export default FileIcon;
