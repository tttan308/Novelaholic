import { useRef, useState } from 'react';
import { downloadFullBook } from '../../services/localStorage';

const DownloadOptionModal = ({ sources, setModalOpen, bookId }) => {
  const boxRef = useRef(null);
  const handleClickOutside = (event) => {
    if (boxRef.current && !boxRef.current.contains(event.target)) {
      setModalOpen(false);
    }
  };
  document.addEventListener('click', handleClickOutside);

  const [fullDownloaded, setfullDownload] = useState(false);
  const [downloaded, setdownloaded] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50">
      <div
        ref={boxRef}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg z-50"
      >
        {!fullDownloaded && (
          <div>
            <div>
              <h1>id: {bookId}</h1>
              {sources.map((item, index) => (
                <h1>source: {item}</h1>
              ))}
            </div>
            {!downloaded && (
              <div>
                <div className="flex justify-between items-center px-2">
                  <h1 className="text-xl font-bold pb-7">
                    Chọn nguồn tải về toàn bộ truyện
                  </h1>
                </div>
                <div className="flex flex-col space-y-4">
                  {sources.map((item, index) => (
                    <button
                      onClick={() => downloadFullBook(bookId, item)}
                      key={index}
                      className="bg-main text-white p-2 rounded-md"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {downloaded && (
              <div>
                <div className="flex justify-between items-center px-2">
                  <h1 className="text-xl font-bold pb-7">
                    Tải về bản cập nhật
                  </h1>
                </div>
                <div className="flex flex-col space-y-4">
                  {sources.map((item, index) => (
                    <button
                      key={index}
                      className="bg-main text-white p-2 rounded-md"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {fullDownloaded && (
          <div>
            <h1 className="text-xl font-bold pb-7">
              Truyện đã được tải về toàn bộ
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};
export default DownloadOptionModal;
