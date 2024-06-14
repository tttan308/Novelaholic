import { useEffect, useRef, useState } from 'react';
import { downloadFullBook, downloadBook, getDownloadedBookInfo, isDownLoaded, isFullDownloaded } from '../../services/localStorage';
import { getChapterCount } from '../../services/content';
import { Button } from "primereact/button";

const DownloadOptionModal = ({sources, setModalOpen, bookId, chapterCount}) => {
  const boxRef = useRef(null);
  const handleClickOutside = (event) => {
    if (!isDownloading && boxRef.current && !boxRef.current.contains(event.target)) {
      setModalOpen(false);
    }
  };
  document.addEventListener('click', handleClickOutside);
  const [isGettingInfo, setIsGettingInfo] = useState(true);
  const [fullDownloadedState, setFullDownloadedState] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [beginChapter, setBeginChapter] = useState(1);
  const [endChapter, setEndChapter] = useState(1);

  const handleFromChapterChange = (event) => {
    setBeginChapter(parseInt(event.target.value));
  };

  const handleToChapterChange = (event) => {
    setEndChapter(parseInt(event.target.value));
  };

  useEffect(() => {
    getDownloadedBookInfo(bookId)
    .then((novel) => {
        if (novel) {
            return Promise.all([isFullDownloaded(novel)]);
        } else {
            throw new Error("Novel not found");
        }
    })
    .then(([isFullDownloadedRes]) => {
        setFullDownloadedState(isFullDownloadedRes);
        setIsGettingInfo(false);
    })
    .catch((error) => {
        setIsGettingInfo(false);
    });
  }, [isDownloading]);

  

  const handleSourceClick = async (sourceId) => {
    setIsDownloading(true);
    await downloadBook(bookId, beginChapter, endChapter, sourceId);
    setIsDownloading(false);
  }

 



  return (
    <>
    {!isDownloading && 
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50">
      <div
        ref={boxRef}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2  -translate-y-1/2 rounded-lg z-50"
      >
        {!isGettingInfo && (
          <div>
            {!fullDownloadedState && (
             <div className="m-0 bg-sub p-6 w-full h-full rounded-lg">
             <h1 className="text-2xl text-white font-bold text-center py-5">
               Chọn danh sách chương muốn tải
             </h1>
             <div className="flex justify-center items-center">
               <p className="text-white font-bold px-4">Từ chương:</p>
               <select
                 className="block bg-white border border-gray-300 h-10 px-4 py-2 focus:outline-none focus:border-blue-500 text-black mx-2"
                 defaultValue={1}

                  onChange={handleFromChapterChange}
               >
                 {[...Array(chapterCount).keys()].map((index) => (
                   <option key={index} value={index + 1}>
                     Chương {index + 1}
                   </option>
                 ))}
               </select>
               <p className=" text-white font-bold px-4">Đến chương:</p>
               <select
                 className="block bg-white border border-gray-300 h-10 px-4 py-2 focus:outline-none focus:border-blue-500 text-black mx-2"
                 defaultValue={1}
                 onChange={handleToChapterChange}
               >
                 {[...Array(chapterCount).keys()].map((index) => (
                   <option key={index} value={index + 1}>
                     Chương {index + 1}
                   </option>
                 ))}
               </select>
             </div>
           
             <h1 className="text-2xl text-white font-bold text-center py-5 mt-5">
               Chọn nguồn tải truyện
             </h1>
           
             <div className="flex justify-center flex-wrap">
               {sources.map((source) => (
                 <Button
                   key={source.id}
                   label={source.name}
                   className="py-2 px-5 bg-main rounded-md m-2 text-white transition duration-200 transform hover:scale-110"
                   onClick={() => handleSourceClick(source.id)}
                 />
               ))}
             </div>
           </div>
           
            )}
            {fullDownloadedState && (
              <>
                <div className="flex justify-between items-center px-2">
                  <h1 className="text-xl font-bold pb-7">
                    Truyện đã được tải toàn bộ
                  </h1>
                </div>
              </>
            )}
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
