import { useEffect, useRef, useState } from 'react';
import { downloadFullBook, getDownloadedBookInfo, isDownLoaded, isFullDownloaded } from '../../services/localStorage';

const DownloadOptionModal = ({sources, setModalOpen, bookId}) => {
  const boxRef = useRef(null);
  const handleClickOutside = (event) => {
    if (!isDownloading && boxRef.current && !boxRef.current.contains(event.target)) {
      setModalOpen(false);
    }
  };
  document.addEventListener('click', handleClickOutside);
  const [isGettingInfo, setIsGettingInfo] = useState(true);
  const [fullDownloaded, setfullDownload] = useState(false);
  const [downloaded, setdownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    getDownloadedBookInfo(bookId)
    .then((novel) => {
        console.log(`1. ${novel}`);

        if (novel) {
            return Promise.all([isDownLoaded(novel), isFullDownloaded(novel)]);
        } else {
            throw new Error("Novel not found");
        }
    })
    .then(([isDownloadedRes, isFullDownloadedRes]) => {
        setdownloaded(isDownloadedRes);
        setfullDownload(isFullDownloadedRes);
        setIsGettingInfo(false);
    })
    .catch((error) => {
        console.error("An error occurred:", error);
        setIsGettingInfo(false);
    });
  }, [isDownloading]);

  return (
    <>
    {!isDownloading && 
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50">
      <div
        ref={boxRef}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2  -translate-y-1/2 bg-white p-4 rounded-lg z-50"
      >
        {!isGettingInfo && !fullDownloaded && (
          <div>
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
                      onClick={() => {
                        downloadFullBook(bookId, item, setIsDownloading);
                        setIsDownloading(true);
                      }
                      }
                      key={item.id}
                      className="bg-main text-white p-2 rounded-md"
                    >
                      {item.name}
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
                      key={item.id}
                      className="bg-main text-white p-2 rounded-md"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {!isGettingInfo && fullDownloaded && (
          <div>
            <h1 className="text-xl font-bold">
              Truyện đã được tải về toàn bộ
            </h1>
          </div>
        )}
      </div>
    </div>
    }
    {isDownloading &&
      <div className="fixed bottom-4 left-4 bg-blue-500 text-white p-3 rounded shadow-lg">
        Đang tải về...
      </div>

    }
    </>
    
  );
};
export default DownloadOptionModal;
