import ReactMarkdown from "react-markdown";
import { useState } from "react";
import "./styles/style.css"
function App(){
  const [smarks, setSmarks] = useState([]);
  function AddSmark(){
    const newSmark = { id: crypto.randomUUID(), text: "" };
    setSmarks(prev => [...prev, newSmark]);
  }
  function UpdateSmark(id, text) {
    setSmarks(prev => prev.map(s => (s.id === id ? { ...s, text } : s)));
  }
  return(
  <>
   <h1>Smarker</h1>
   <h6>A Markdown editor with no fuzz</h6>
   <button onClick={AddSmark}>+</button>
{smarks.map(smark => (
  <div key={smark.id}>
    <textarea
      value={smark.text}
      onChange={e => UpdateSmark(smark.id, e.target.value)}
    />
    <ReactMarkdown>{smark.text}</ReactMarkdown>
  </div>
))}    
  </>
  )
}

export default App;
