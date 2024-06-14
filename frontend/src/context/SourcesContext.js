import React, { createContext, useState, useEffect, useRef } from "react";
import global from "../GlobalVariables";

export const SourcesContext = createContext();

export const SourcesProvider = ({ children }) => {
  const isMounted = useRef(false);

  const [sources, setSources] = useState(() => {
    const savedSources = localStorage.getItem("sources");
    return savedSources ? JSON.parse(savedSources) : [];
  });

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    localStorage.setItem("sources", JSON.stringify(sources));

    if (global.currentState === -1) {
      global.currentState = 0;
    }
  }, [sources]);

  return (
    <SourcesContext.Provider value={{ sources, setSources }}>
      {children}
    </SourcesContext.Provider>
  );
};

export const sources = SourcesProvider.sources;
