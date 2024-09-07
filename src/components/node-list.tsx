import { DragEvent } from "react";
import { TbReport, TbWorldSearch } from "react-icons/tb";

const nodeTypes = [
    {
        type: "webScrapper",
        label: "WebScrapper",
    },
    {
        type: "summary",
        label: "Summary",
    },
]

const NodeList = () => {
    const onDragStartHandler = (e: DragEvent<HTMLDivElement>, nodeType: string) => {
      e.dataTransfer.setData("application/reactflow", nodeType);
      e.dataTransfer.effectAllowed = "move";
    };

    return (
      <div className="flex flex-col gap-y-2">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className="bg-gray-700 p-2 mb-2 rounded cursor-move flex items-center justify-center gap-x-4"
            onDragStart={(event) => onDragStartHandler(event, node.type)}
            draggable
          >
            {node.type === "summary" ? <TbReport className="size-6 text-white" /> : <TbWorldSearch className="size-6 text-white" />}
            <span>{node.label}</span>
          </div>
        ))}
      </div>
    );
}

export default NodeList