import React from "react";
import { useState, useEffect, useRef } from "react";
import { FaCog, FaDownload, FaBars } from "react-icons/fa";
import SettingBox from "./settingBox";
import {
  setFont,
  setFontSize,
  setBackground,
  setTextColor,
  setLineHeight,
  getFont,
  getFontSize,
  getBackground,
  getTextColor,
  getLineHeight,
} from "./textConfig";
import ExportButton from "./export";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  saveBookHistory,
  getDownloadedBookChapter,
  getSourcesFromLocalStorage,
} from "../../services/localStorage";
import {
  getChapter,
  getSources,
  getChapterCount,
  getSourceChapterIds,
  getNovelInfo,
} from "../../services/content";
import DownloadOptionModal from "./DownloadOptionModal";
import ChaptersModal from "./ChaptersModel";

const BookContent = () => {
  const [chapterData, setChapterData] = useState([]);
  const { id, chapter, sourceId } = useParams();
  const [source, setSource] = useState(sourceId);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterCount, setChapterCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchChapterData() {
      setLoading(true);
      const res = await getChapter(id, chapter, sourceId);
      if (res) {
        setChapterData(res);
        saveBookHistory(id, chapter, sourceId);
      } else {
        setChapterData({
          novelTitle: "Không tìm thấy truyện",
          chapterTitle: "Không tìm thấy chương",
          chapterContent: "",
        });
      }
      setLoading(false);
    }
    getDownloadedBookChapter(id, chapter)
      .then((res) => {
        if (
          res &&
          res.chapters.some((item) => item.number === parseInt(chapter))
        ) {
          console.log('asd', res);
          setChapterData(res);
          saveBookHistory(id, chapter);
          setLoading(false);
          console.log(res);
          setChapterCount(res.chapterCount);
          console.log("chapter Load from indexDB");
          setSources([]);
        } else {
          console.log('not find')
          fetchChapterData();
          getChapterCount(id, source).then((res) => {
            setChapterCount(res);
          });
          
          const fetchSource = async () => {
            const sources = await getSources();
            console.log('Sources: ', sources)
            const novelInfo = await getNovelInfo(id, source);
            console.log('Novel Info: ', novelInfo)
            const sourceChapterIds = await getSourceChapterIds (novelInfo, sources);
            setSources(sourceChapterIds);
            console.log('Souces: ', sourceChapterIds)
          };

          fetchSource();
          // const tmpSources = getSourcesFromLocalStorage();

          // getNovelInfo(id, source)
          //   .then((res) => {
          //     return getSourceChapterIds(res, tmpSources);
          //   })
          //   .then((res) => {
          //     console.log("get source chapter ids: ", res)
          //     setSources(res);
          //   });
          // console.log("chapter fetch from server");
        }
      })
      .catch((error) => {
        console.error("Error fetching book chapter: ", error);
        
        fetchChapterData();
        getChapterCount(id, source).then((res) => {
          setChapterCount(res);
        });
        const tmpSources = getSourcesFromLocalStorage();
        getNovelInfo(id, source)
          .then((res) => {
            return getSourceChapterIds(res, tmpSources);
          })
          .then((res) => {
            setSources(res);
          });
        console.log("Loaded from server 2");
      });
  }, [id, chapter, source]);

  //DOM loaded event
  useEffect(() => {
    setBackground(getBackground());
    setTextColor(getTextColor());
    setFont(getFont());
    setFontSize(getFontSize());
    setLineHeight(getLineHeight());
  }, []);

 
  

  const handleChapterSelectionChanged = (event) => {
    const value = event.target.value;
    navigate(`/book/${id}/${value}/${source}`);
  };

  return (
    <div id="bookcontentpage" className="container mx-auto">
      <SideBox sources={sources} chapterCount={chapterCount} />
      {/* title */}
      {loading && (
        <p className="text-2xl font-bold text-center py-4 font-opensans text-sub">
          Loading...
        </p>
      )}
      {!loading && (
        <p className="text-2xl font-bold text-center py-4 font-opensans text-sub">
          {chapterData.chapterTitle}
        </p>
      )}

      <p className="text-xl font-bold text-center my-2 text-main font-opensans">
        {chapterData.novelTitle}
      </p>

      {!loading && (
        <div className="text-center my-6">
          <div className="flex items-center justify-center space-x-6">
            {chapter > 1 && (
              <Link
                to={`/book/${id}/${parseInt(chapter) - 1}/${source}`}
                className="bg-main w-10 h-10 rounded-full flex items-center justify-center text-3xl text-white"
              >
                &lt;
              </Link>
            )}
            {chapter == 1 && (
              <div className="bg-main-light w-10 h-10 rounded-full flex items-center justify-center text-3xl text-white">
                &lt;
              </div>
            )}

            <select
              onChange={handleChapterSelectionChanged}
              value={chapter}
              className="block bg-white border border-gray-300 h-10 px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              {[...Array(chapterCount).keys()].map((index) => (
                <option key={index} value={index + 1}>
                  Chương {index + 1}
                </option>
              ))}
            </select>
            {chapter < chapterCount && (
              <Link
                to={`/book/${id}/${parseInt(chapter) + 1}/${source}`}
                className="bg-main w-10 h-10 rounded-full flex items-center justify-center text-3xl text-white"
              >
                &gt;
              </Link>
            )}

            {chapter == chapterCount && (
              <div className="bg-main-light w-10 h-10 rounded-full flex items-center justify-center text-3xl text-white">
                &gt;
              </div>
            )}
          </div>
        </div>
      )}

      <div id="source-selection" className="pb-6 text-center mb-6">
        {sources.map((item) => (
          <button
            key={item.id}
            className={`mx-1 text-white px-4 py-2 rounded-md ${
              item.id === source ? "  bg-sub" : "bg-main"
            }`}
            onClick={() => {
              setSource(item.id);
              navigate(`/book/${item.chapterId}/${chapter}/${item.id}`);
            }}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* content */}
      <div id="bookcontent-content" className=" mx-52">
        {loading && (
          <p className="text-center text-inherit bg-inherit py-6">Loading...</p>
        )}
        {!loading && (
          <p
            className="text-inherit bg-inherit"
            dangerouslySetInnerHTML={{
              __html: chapterData.chapterContent,
            }}
          ></p>
        )}
      </div>

      {!loading && (
        <div className="text-center py-6 mb-10">
          <div className="flex items-center justify-center space-x-6">
            {chapter > 1 && (
              <Link
                to={`/book/${id}/${parseInt(chapter) - 1}/${source}`}
                className="bg-main w-10 h-10 rounded-full flex items-center justify-center text-3xl text-white"
              >
                &lt;
              </Link>
            )}
            {chapter == 1 && (
              <div className="bg-main-light w-10 h-10 rounded-full flex items-center justify-center text-3xl text-white">
                &lt;
              </div>
            )}
            <select
              onChange={handleChapterSelectionChanged}
              value={chapter}
              className="block bg-white border border-gray-300 h-10 px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              {[...Array(chapterCount).keys()].map((index) => (
                <option key={index} value={index + 1}>
                  Chương {index + 1}
                </option>
              ))}
            </select>
            {chapter < chapterCount && (
              <Link
                to={`/book/${id}/${parseInt(chapter) + 1}/${source}`}
                className="bg-main w-10 h-10 rounded-full flex items-center justify-center text-3xl text-white"
              >
                &gt;
              </Link>
            )}
            {chapter == chapterCount && (
              <div className="bg-main-light w-10 h-10 rounded-full flex items-center justify-center text-3xl text-white">
                &gt;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const SideBox = ({ sources, chapterCount }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showDownloadOptionModal, setShowDownloadOptionModal] = useState(false);
  const [showChaptersModal, setShowChaptersModal] = useState(false);
  const { id, chapter } = useParams();

  const boxRef = useRef(null);
  const handleClickOutside = (event) => {
    const beforeclick = showSettings;
    if (boxRef.current && !boxRef.current.contains(event.target)) {
      setTimeout(() => {
        if (beforeclick === showSettings) {
          setShowSettings(false);
        }
      }, 0);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
  });

  return (
    <div>
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 py-3 px-3 bg-white border p-2 border-gray-400 flex flex-col space-y-4">
        <button
          className="text-main hover:text-black"
          onClick={() => {
            const beforeclick1 = showSettings;
            setTimeout(() => {
              if (beforeclick1 === showSettings) {
                setShowSettings(true);
              }
            }, 0);
          }}
        >
          <FaCog size={26} />
        </button>
        <button
          onClick={() =>
            setTimeout(() => {
              setShowChaptersModal(true);
            }, 0)
          }
          className="text-main hover:text-black"
        >
          <FaBars size={26} />
        </button>
        <button
          onClick={() =>
            setTimeout(() => {
              setShowDownloadOptionModal(true);
            }, 0)
          }
          className="text-main hover:text-black"
        >
          <FaDownload size={26} />
        </button>
        {/* <button className="text-main hover:text-black"
      >
        <FaFileExport size={24} />
      </button> */}
        <ExportButton novelId={id} chapter={chapter} />
      </div>
      {showSettings && (
        <div ref={boxRef}>
          <SettingBox />
        </div>
      )}
      {showDownloadOptionModal && (
        <DownloadOptionModal
          sources={sources}
          bookId={id}
          setModalOpen={setShowDownloadOptionModal}
          chapterCount={chapterCount}
        />
      )}
      {showChaptersModal && (
        <ChaptersModal
          chapterCount={chapterCount}
          setModalOpen={setShowChaptersModal}
        />
      )}
    </div>
  );
};

const DownloadingNotification = ({ message, onClose, duration = 3000 }) => {
  return (
    <div className="fixed bottom-4 left-4 bg-blue-500 text-white p-3 rounded shadow-lg">
      {message}
    </div>
  );
};

export default BookContent;
