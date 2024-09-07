
import './App.css'
import "@xyflow/react/dist/style.css";
import Sidebar from './components/sidebar';
import Workspace from './components/flow/workspace';
function App() {
  
  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <Workspace />
    </div>
  );
}

export default App
