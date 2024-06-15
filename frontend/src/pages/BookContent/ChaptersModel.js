import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ChaptersModal = ({ chapterCount, setModalOpen }) => {
  const boxRef = useRef(null);
  const navigate = useNavigate();
  const { id, chapter, sourceId } = useParams();

  const handleClickOutside = (event) => {
    if (boxRef.current && !boxRef.current.contains(event.target)) {
      setModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleChapterClick = (chapter) => {
    navigate(`/book/${id}/${chapter}/${sourceId}`);
    setModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div ref={boxRef} className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Chapters</h2>
        <ul className="max-h-96 overflow-y-auto">
          {Array.from({ length: chapterCount }, (_, index) => (
            <li
              key={index}
              className="cursor-pointer p-2 hover:bg-gray-200"
              onClick={() => handleChapterClick(index + 1)}
            >
              Chapter {index + 1}
            </li>
          ))}
        </ul>
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => setModalOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ChaptersModal;
