import { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import routes from "./routes";
import Layout from "./layout/Layout";
import { fetchSources } from "./services/source";
import { SourcesContext } from "./context/SourcesContext";
import global from "./GlobalVariables";

function App() {
  const sourcesContext = useContext(SourcesContext);

  useEffect(() => {
    const getSources = async () => {
      const sourcesAPI = await fetchSources();
      const sourcesLocal = sourcesContext.sources;

      if (Array.isArray(sourcesLocal) && sourcesLocal.length === 0) {
        sourcesAPI.sort((source_1, source_2) => source_1.id - source_2.id); // remove
        sourcesContext.setSources(sourcesAPI);
      } else {
        const setSourcesLocal = new Set(
          sourcesLocal.map((source) => JSON.stringify(source))
        );

        const setSourcesAPI = new Set(
          sourcesAPI.map((source) => JSON.stringify(source))
        );

        const addSources = sourcesAPI.filter(
          (source) => !setSourcesLocal.has(JSON.stringify(source))
        );

        const removeSources = sourcesLocal.filter(
          (source) => !setSourcesAPI.has(JSON.stringify(source))
        );

        removeSources.forEach((source) => {
          const index = sourcesLocal.findIndex(
            (s) => JSON.stringify(s) === JSON.stringify(source)
          );

          if (index !== -1) {
            sourcesLocal.splice(index, 1);
          }
        });

        sourcesLocal.push(...addSources);
        sourcesContext.setSources([...sourcesLocal]);

        global.removeSources = removeSources;
      }
    };

    getSources();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {routes.map((route, index) => {
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <route.component />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
