import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ChaptersModal = ({ chapterCount, setModalOpen }) => {
  const boxRef = useRef(null);
  const navigate = useNavigate();
  const { id, chapter } = useParams();

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
    navigate(`/book/${id}/${chapter}`);
    setModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div ref={boxRef} className="bg-white p-6 rounded-lg max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Chapters</h2>

          <button
            onClick={() => setModalOpen(false)}
            className="text-4xl bg-transparent border-0 text-gray-700 float-right leading-none outline-none focus:outline-none"
          >
            &times;
          </button>
        </div>

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
        {/* <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => setModalOpen(false)}
        >
          Close
        </button> */}
      </div>
    </div>
  );
};

export default ChaptersModal;
