import { CreateWebWorkerMLCEngine } from "@mlc-ai/web-llm";

const initEngine = async (setStatus) => {
  // 1. Create the worker instance using Vite's worker constructor
  const worker = new Worker(new URL("../../aiContext.worker.js", import.meta.url), {
    type: "module",
  });

  // 2. Initialize the engine inside that worker
  const engine = await CreateWebWorkerMLCEngine(
    worker,
    "Qwen2-1.5B-Instruct-q4f16_1-MLC",
    {
      initProgressCallback: (report) => setStatus(report.text),
    },
  );

  return engine;
};

export { initEngine };
