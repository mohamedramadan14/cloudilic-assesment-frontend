import {
  ReactFlow,
  addEdge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  Edge,
  Node,
  MarkerType,
  Connection,
} from "@xyflow/react";

import SummaryNode from "../nodes/summary-node";
import WebScrapperNode from "../nodes/web-scrapper-node";
import { useCallback, DragEvent } from "react";
import "@xyflow/react/dist/style.css";

type NodeTypes = {
  webScrapper: typeof WebScrapperNode;
  summary: typeof SummaryNode;
};

const nodeTypes: NodeTypes = {
  webScrapper: WebScrapperNode,
  summary: SummaryNode,
};

const initialNodes = [] as Node[];
const initialEdges = [] as Edge[];
const Workspace = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  

  const onConnect = useCallback(
    (params: Connection) => {
      console.log("params",params);
       setEdges((eds) => addEdge({
         style: {
           stroke: "#6b7280",
           strokeDasharray: "5,5",
           strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#6b7280",
          },
          ...params,
          },
          eds
        )
      )},[setEdges]
  );

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("application/reactflow");
      console.log(type);
      const position = {
        x: e.clientX - 250,
        y: e.clientY - 50,
      };

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type} node` ,/*  dataOnchange */ },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  return (
    <div className="flex-grow h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default Workspace;
 