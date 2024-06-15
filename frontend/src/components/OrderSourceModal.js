import React, { useContext } from "react";
import { useLocation, useMatch } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SourcesContext } from "../context/SourcesContext";
import global from "../GlobalVariables";
import { findId } from "../services/novel";

const OrderSourceModal = ({ isVisible, onClose }) => {
  const location = useLocation();
  const { sources, setSources } = useContext(SourcesContext);
  const bookInfoMatch = useMatch("/book/:id");

  if (!isVisible) return null;

  const sourcesCopy = [...sources];

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const [removed] = sourcesCopy.splice(result.source.index, 1);
    sourcesCopy.splice(result.destination.index, 0, removed);
  };

  const handleSave = async () => {
    onClose();
    if (sources[0] !== sourcesCopy[0]) {
      setSources(sourcesCopy);

      if (location.pathname === "/" || location.pathname === "/search") {
        const params = new URLSearchParams(location.search);
        params.set("source", `${sourcesCopy[0].id}`);
        const newUrl = `${location.pathname}?${params.toString()}`;
        window.location.href = newUrl;
      } else if (bookInfoMatch) {
        let bookId = "";
        let newSource = -1;

        for (let i = 0; i < sourcesCopy.length; i++) {
          bookId = await findId(
            sourcesCopy[i].id,
            global.currentTitle,
            global.currentAuthor
          );

          if (bookId !== "") {
            newSource = sourcesCopy[i].id;
            break;
          }
        }

        const newUrl = `/book/${bookId}?source=${newSource}`;
        let currentUrl = new URL(window.location.href);

        if (currentUrl.pathname + currentUrl.search !== newUrl) {
          window.location.href = newUrl;
        }
      }
    } else {
      setSources(sourcesCopy);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl w-[500px]">
        {/* Modal header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-[25px] font-bold">Thứ tự ưu tiên</h2>

          <button
            onClick={onClose}
            className="text-4xl bg-transparent border-0 text-gray-700 float-right leading-none outline-none focus:outline-none"
          >
            &times;
          </button>
        </div>

        {/* Modal body */}
        <div className="p-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-200 space-y-3 p-2"
                >
                  {sourcesCopy.map((source, index) => (
                    <Draggable
                      key={source.id.toString()}
                      draggableId={source.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="border p-4 bg-white rounded shadow-md shadow-gray-400"
                        >
                          <div className="text-main font-bold text-[20px] pb-2">
                            {source.name}
                          </div>
                          <div className="text-sub">
                            {new URL(source.url).hostname || source.url}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Modal footer */}
        <div className="p-4 float-right">
          <button
            onClick={onClose}
            className="font-semibold bg-sub text-white text-base font-inter h-[40px] w-[90px] rounded-[5px] mr-4 transition duration-200 hover:scale-110"
          >
            Hủy
          </button>

          <button
            onClick={handleSave}
            className="font-semibold bg-sub text-white text-base font-inter h-[40px] w-[90px] rounded-[5px] transition duration-200 hover:scale-110"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSourceModal;
