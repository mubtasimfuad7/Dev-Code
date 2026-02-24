import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context'
import { EditorContextProvider } from './contexts/MonacoContext.jsx'
import AiContextProvider from './contexts/AiContexts/AiContextProvider.jsx'

createRoot(document.getElementById("root")).render(
  <AppContextProvider>
    <EditorContextProvider>
      {/* <AiContextProvider> */}
        <App></App>
      {/* </AiContextProvider> */}
    </EditorContextProvider>
  </AppContextProvider>,
);
