/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useNodesData,
  useHandleConnections,
} from "@xyflow/react";
import { useEffect, useState } from "react";
import { TbReport } from "react-icons/tb";
import axios from "axios"
import { BACKEND_URL_LOCAL } from "../../constants";


const SummaryNode = ({
  id,
}: NodeProps<Node<any>>) => {
  const webScrapperConnections = useHandleConnections({
    type: "target",
    id: id,
  });

  const [summarizedData , setSummarizedData] = useState<string>("");

  
  const generateSummary = async (scrappedData: string) => {
    if(!scrappedData) return "No data to summarize.";
    try {
      setSummarizedData("");
      const response = await axios.post<{ data: string }>(
        `${BACKEND_URL_LOCAL}/summarize`,
        { data: scrappedData }
      );
      if(response.data?.data) {
        setSummarizedData(response.data?.data);
      }
    } catch (error) {
      console.error("Error summarizing:", error);
      return "Error summarizing.";
    }
  }
  
  const webScrapperData = useNodesData(webScrapperConnections?.[0]?.source);
  
   useEffect(() => {
     if (webScrapperData) {
       generateSummary(webScrapperData?.data?.scrappedData as string);
     }
   }, [webScrapperData]);

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <Handle type="target" position={Position.Left} id={id} />

      <div className="bg-blue-100 p-2 flex items-center gap-x-2">
        <TbReport className="size-4 text-gray-700" />
        <span className="font-bold text-gray-700 ml-2">Summary</span>
      </div>

      <div className="p-4">
        <div className="mb-2 text-sm text-gray-600">Output</div>
        <textarea
          cols={45}
          rows={15}
          className="w-full h-24 p-2 text-sm text-gray-700 border border-gray-300 rounded focus-visible:outline-none"
          placeholder="Here the summary of the scrapped data"
          value={(summarizedData as string) || "No data to summarize."}
          readOnly
        />
      </div>
    </div>
  );
};

export default SummaryNode