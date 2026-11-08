import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState } from "react";
import { loadSmarks, saveSmark, deleteSmark } from "./storage";
import "./styles/style.css"
import "./styles/colors.css"

function App(){
  const [smarks, setSmarks] = useState([]);
  const timers = useRef({});

  useEffect(() => {
    loadSmarks()
      .then(list => setSmarks(list.sort((a, b) => a.id.localeCompare(b.id))))
      .catch(console.error);
  }, []);

  function AddSmark(){
    const newSmark = { id: String(Date.now()), text: "" };
    setSmarks(prev => [...prev, newSmark]);
    saveSmark(newSmark.id, "").catch(console.error);
  }
  function UpdateSmark(id, text) {
    setSmarks(prev => prev.map(s => (s.id === id ? { ...s, text } : s)));
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(
      () => saveSmark(id, text).catch(console.error),
      400,
    );
  }
  function DelSmark(id) {
    clearTimeout(timers.current[id]);
    setSmarks(prev => prev.filter(s => s.id !== id));
    deleteSmark(id).catch(console.error);
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
