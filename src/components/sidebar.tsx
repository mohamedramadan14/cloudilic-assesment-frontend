// Test Comment
import NodeList from "./node-list";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <div className="mb-8 flex items-center justify-center">
        <img src="/cloudilic_logo.png" alt="Logo" className="w-20 h-20 mr-3" loading="lazy"/>
      </div>
      <NodeList />
    </div>
  );
};

export default Sidebar;
