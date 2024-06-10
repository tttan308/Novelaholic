import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { FaCog, FaDownload, FaBars } from 'react-icons/fa';
import SettingBox from './settingBox';
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
} from './textConfig';
import ExportButton from './export';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { saveBookHistory, getDownloadedBookChapter } from '../../services/localStorage';
import { getChapter, getSources } from '../../services/content';
import DownloadOptionModal from './DownloadOptionModal';

const BookContent = () => {
  const [chapterData, setChapterData] = useState([]);
  const [source, setSource] = useState(1); 
  const { id, chapter } = useParams();
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchChapterData() {
      setLoading(true);
      const res = await getChapter(id, chapter, source);
      if (res) {
        setChapterData(res);
        saveBookHistory(id, chapter);
      } else {
        setChapterData({
          novelTitle: 'Không tìm thấy truyện',
          chapterTitle: 'Không tìm thấy chương',
          chapterContent: '',
        });
      }
      setLoading(false);
    }
    getDownloadedBookChapter(id, chapter).then((res) => {
      if (res) {
        setChapterData(res);
        setLoading(false);
        console.log('Loaded from downloaded');
      } else {
        fetchChapterData();
        console.log('Loaded from server 1');
      }
    }).catch((error) => {
      console.error("Error fetching book chapter: ", error);
      fetchChapterData();
      console.log('Loaded from server 2');
    });
  }, [id, chapter, source]);

  //DOM loaded event
  useEffect(() => {
    setBackground(getBackground());
    setTextColor(getTextColor());
    setFont(getFont());
    setFontSize(getFontSize());
    setLineHeight(getLineHeight());
    getSources().then((res) => {
      setSources(res);
    });
  }, []);

  const handleChapterSelectionChanged = (event) => {
    const value = event.target.value;
    navigate(`/book/${id}/${value}`);
  };

  return (
    <div id="bookcontentpage" className="container mx-auto">
      <SideBox sources={sources}/>
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

      {/* chapter */}
      <div className="text-center my-6">
        <div className="flex items-center justify-center space-x-6">
          <Link
            to={`/book/${id}/${parseInt(chapter) - 1}`}
            className="bg-main w-10 h-10 rounded-full flex items-center justify-center text-3xl text-white"
          >
            &lt;
          </Link>
          <select
            onChange={handleChapterSelectionChanged}
            value={chapter}
            className="block bg-white border border-gray-300 h-10 px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            {[...Array(chapterData.totalChapters).keys()].map((index) => (
              <option key={index} value={index + 1}>
                Chương {index + 1}
              </option>
            ))}
          </select>
          <Link
            to={`/book/${id}/${parseInt(chapter) + 1}`}
            className="bg-main w-10 h-10 rounded-full flex items-center justify-center text-3xl text-white"
          >
            &gt;
          </Link>
        </div>
      </div>

      <div id='source-selection' className='pb-6 text-center'>
            {sources.map((item) => (
                <button
                    key={item.id}
                    className={`mx-1 text-white px-4 py-2 rounded-md ${item.id === source ? '  bg-blue-500' : 'bg-main'}`}
                    onClick={() => {
                        setSource(item.id);
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
            dangerouslySetInnerHTML={{ __html: chapterData.chapterContent }}
          ></p>
        )}
      </div>

      {/* chapter */}
      <div className="text-center py-6">
        <div className="flex items-center justify-center space-x-6">
          <Link
            to={`/book/${id}/${parseInt(chapter) - 1}`}
            className="bg-main w-10 h-10 rounded-full flex items-center justify-center text-3xl text-white"
          >
            &lt;
          </Link>
          <select
            onChange={handleChapterSelectionChanged}
            value={chapter}
            className="block bg-white border border-gray-300 h-10 px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            {[...Array(chapterData.totalChapters).keys()].map((index) => (
              <option key={index} value={index + 1}>
                Chương {index + 1}
              </option>
            ))}
          </select>
          <Link
            to={`/book/${id}/${parseInt(chapter) + 1}`}
            className="bg-main w-10 h-10 rounded-full flex items-center justify-center text-3xl text-white"
          >
            &gt;
          </Link>
        </div>
      </div>
    </div>
  );
};

const SideBox = ({sources}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showDownloadOptionModal, setShowDownloadOptionModal] = useState(false);
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
    document.addEventListener('click', handleClickOutside);
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
        <button className="text-main hover:text-black">
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
