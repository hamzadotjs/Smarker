import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState } from "react";
import { loadSmarks, saveSmark, deleteSmark } from "./storage";
import "./styles/style.css"
import "./styles/colors.css"

function getDisplayName(smark) {
  const firstLine = smark.text.split('\n')[0];
  if (firstLine.startsWith('# ')) {
    return firstLine.slice(2);
  }
  return smark.id;
}

function App(){
  const [smarks, setSmarks] = useState([]);
  const [selectedSmarkId, setSelectedSmarkId] = useState(null);
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
    setSelectedSmarkId(newSmark.id);
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
    if (selectedSmarkId === id) {
      setSelectedSmarkId(null);
    }
    deleteSmark(id).catch(console.error);
  }
  function handleFileSelect(smark) {
    setSelectedSmarkId(smark.id);
  }

  const selectedSmark = smarks.find(s => s.id === selectedSmarkId);

  return (
   <div className="app-container">
     <div className="sidebar">
       <div className="sidebar-header">
         <h3>smarker</h3>
         <button className="addbtn" onClick={AddSmark}>+</button>
       </div>
       
       <ul className="file-list">
         {smarks.map(smark => (
           <li 
             key={smark.id} 
             onClick={() => handleFileSelect(smark)}
             className={selectedSmarkId === smark.id ? 'active' : ''}
           >
             {getDisplayName(smark)}
             <button 
               className="delbtn sidebar-del" 
               onClick={(e) => { e.stopPropagation(); DelSmark(smark.id); }}
             >
               x
             </button>
           </li>
         ))}
       </ul>
     </div>
     
     <div className="main-area">
       <div className="editor-section">
         {selectedSmark ? (
           <textarea 
             value={selectedSmark.text} 
             onChange={e => UpdateSmark(selectedSmark.id, e.target.value)}
           />
         ) : (
           <div className="no-selection">Select a file to edit</div>
         )}
       </div>
       
       <div className="preview-section">
         <ReactMarkdown>{selectedSmark?.text ?? ""}</ReactMarkdown>
       </div>
     </div>
   </div>
)
}

export default App;