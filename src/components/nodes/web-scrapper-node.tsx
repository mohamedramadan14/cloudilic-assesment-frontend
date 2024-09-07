/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Handle, Node, Position, NodeProps, useReactFlow } from "@xyflow/react";
import React, { useCallback, useState } from "react";
import debounce from "lodash.debounce";
import { TbWorldSearch } from "react-icons/tb";
import axios from "axios";
import { BACKEND_URL_PROD } from "../../constants";


const WebScraperNode = ({ id, data }: NodeProps<Node<any>>) => {
  const { updateNodeData } = useReactFlow();
  const [url, setUrl] = useState(data.value || "");
  const [disabled, setDisabled] = useState(false);
  
  const handleScrape = useCallback(
    debounce(async (inputUrl: string) => {
      if (!inputUrl) return;
      try {
        setDisabled(true);
        const response = await axios.post<{ data: string }>(
          `${BACKEND_URL_PROD}/scrape`,
          { url: inputUrl }
        );

        if(response.data.data) {
          updateNodeData(id, { scrappedData: response.data.data });
        }
        setDisabled(false);
      } catch (error) {
        console.error("Error scraping:", error);
      }
    }, 1000),
    [id, data]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
      handleScrape(e.target.value);
    },
    [id]
  );

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden w-full">
      <div className="bg-blue-100 p-2 flex items-center gap-x-2">
        <TbWorldSearch className="size-4 text-gray-700" />
        <span className="font-bold text-gray-700">WebScrapper</span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-x-4">
          <span className="text-gray-700 mr-2">URL</span>
          <input
            id={`url-input-${id}`}
            className="border border-gray-300 p-1 flex-grow rounded"
            placeholder="Enter URL"
            value={url}
            onChange={onInputChange}
            disabled={disabled}
          />
          <Handle type="source" position={Position.Right} id={id} />
        </div>
      </div>
    </div>
  );
};

export default WebScraperNode;
