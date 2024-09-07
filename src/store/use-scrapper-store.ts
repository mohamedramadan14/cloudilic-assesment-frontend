import { create } from "zustand";
import { Edge } from "@xyflow/react";
import debounce from "lodash.debounce";

interface ScraperData {
  url: string;
  scrapedData: string;
  summary: string;
  isScrapingComplete: boolean;
}

interface ScrapperState {
  scraperNodes: { [key: string]: ScraperData };
  summaryNodes: { [key: string]: string };
  edges: Edge[];
  setScraperUrl: (id: string, url: string) => void;
  setScrappedData: (id: string, data: string) => void;
  setSummary: (scraperId: string, summary: string) => void;
  setEdges: (edges: Edge[]) => void;
  fetchScrapedData: (id: string) => Promise<void>;
  fetchSummary: (id: string) => Promise<void>;
}

export const useScrapperStore = create<ScrapperState>((set, get) => ({
  scraperNodes: {},
  summaryNodes: {},
  edges: [],
  setScraperUrl: (id, url) =>
    set((state) => ({
      scraperNodes: {
        ...state.scraperNodes,
        [id]: { ...state.scraperNodes[id], url, isScrapingComplete: false },
      },
    })),
  setScrappedData: (id, data) =>
    set((state) => ({
      scraperNodes: {
        ...state.scraperNodes,
        [id]: {
          ...state.scraperNodes[id],
          scrapedData: data,
          isScrapingComplete: true,
        },
      },
    })),
  setSummary: (scraperId, summary) => {
    set((state) => {
      const newScraperNodes = {
        ...state.scraperNodes,
        [scraperId]: { ...state.scraperNodes[scraperId], summary },
      };
      const newSummaryNodes = { ...state.summaryNodes };

      // Update connected summary nodes
      state.edges
        .filter((edge) => edge.source === scraperId)
        .forEach((edge) => {
          if (edge.target) {
            newSummaryNodes[edge.target] = summary;
          }
        });

      return { scraperNodes: newScraperNodes, summaryNodes: newSummaryNodes };
    });
  },
  setEdges: (edges) => {
    set({ edges });
  },
  fetchScrapedData: debounce(async (id) => {
    const { scraperNodes, setScrappedData, fetchSummary } = get();
    const url = scraperNodes[id]?.url;

    if (!url) {
      console.log("No URL found. Skipping fetch.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const result = await response.json();
      if (result.data) {
        setScrappedData(id, result.data);
        // Fetch summary immediately after scraping is complete
        await fetchSummary(id);
      }
    } catch (error) {
      console.error("Error fetching scraped data:", error);
    }
  }, 500),
  fetchSummary: async (id) => {
    const { scraperNodes, edges, setSummary } = get();
    const scrapedData = scraperNodes[id]?.scrapedData;
    const isScrapingComplete = scraperNodes[id]?.isScrapingComplete;

    // Check if there's a connection between scraper and summary
    const hasConnection = edges.some(
      (edge) => edge.source === id && edge.target
    );

    if (!hasConnection || !scrapedData || !isScrapingComplete) {
      console.log(
        "No connection, scraped data, or scraping not complete. Skipping summary."
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: scrapedData }),
      });
      const result = await response.json();
      if (result.summary) {
        setSummary(id, result.summary);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  },
}));
