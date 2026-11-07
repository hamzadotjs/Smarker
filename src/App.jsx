import ReactMarkdown from "react-markdown";
import { useState } from "react";
import "./styles/style.css"
import "./styles/colors.css"
function App(){
  const [smarks, setSmarks] = useState([]);
  function AddSmark(){
    const newSmark = { id: crypto.randomUUID(), text: "" };
    setSmarks(prev => [...prev, newSmark]);
  }
  function UpdateSmark(id, text) {
    setSmarks(prev => prev.map(s => (s.id === id ? { ...s, text } : s)));
  }
  function DelSmark(id) {
    setSmarks(prev => prev.filter(s => s.id !== id));
  }
  return (
  <>
    <div className="head">
      <div className="title">
        <h1>Smarker</h1>
        <h6>A Markdown editor with no fuzz</h6>
      </div>
      <button className="addbtn" onClick={AddSmark}>+</button>
    </div>
    <div className="smarks">
      {smarks.map(smark => (
        <div className="smark" key={smark.id}>
          <textarea
            value={smark.text}
            onChange={e => UpdateSmark(smark.id, e.target.value)}
          />
          <button className="delbtn" onClick={() => DelSmark(smark.id)}>x</button>
          <div className="preview">
            <ReactMarkdown>{smark.text}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  </>
)
}

export default App;
