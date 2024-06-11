import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const OrderSourceModal = ({
    isVisible,
    onClose,
    listSource,
    updateSources,
}) => {
    if (!isVisible) return null;

    const listSourceCopy = [...listSource];

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const [removed] = listSourceCopy.splice(result.source.index, 1);
        listSourceCopy.splice(result.destination.index, 0, removed);
    };

    const handleSave = () => {
        onClose();
        updateSources(listSourceCopy);
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
                                    {listSourceCopy.map((source, index) => (
                                        <Draggable
                                            key={source.id}
                                            draggableId={source.id}
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
                                                        {source.url}
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
