import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaChevronDown, FaLongArrowAltRight } from "react-icons/fa";
import HotNovels from "../components/HotNovels";
import SearchBox from "../components/SearchBox";
import { getFiveRecentBooks, getBookHistory } from "../services/localStorage";
import testSources from "../services/test";
import global from "../GlobalVariables";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState(false);
  let shouldRender = false;

  if (global.currentState > 0) {
    shouldRender = true;
  } else {
    const queryParams = new URLSearchParams(location.search);

    const getAvailableSource = async () => {
      while (global.currentState === -1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      let shouldNavigate = false;

      if (!queryParams.has("source")) {
        shouldNavigate = true;
      } else {
        const sourceParam = queryParams.get("source");

        if (
          global.removeSources.some(
            (item) => item.id === parseInt(sourceParam, 10)
          )
        ) {
          shouldNavigate = true;
        }
      }

      if (shouldNavigate) {
        const sourceId = await testSources();

        global.currentState = 1;
        queryParams.set("source", sourceId);
        navigate({ search: queryParams.toString() });
      } else {
        global.currentState = 1;
        shouldRender = true;
        setState(!state);
      }
    };

    getAvailableSource();
  }

  const lastFiveReading = getFiveRecentBooks() || [];
  const historyReading = getBookHistory() || [];

  const [recentNovels, setRecentNovels] = useState(lastFiveReading);
  const [isShowAllHistory, setIsShowAllHistory] = useState(
    historyReading.length <= 5
  );

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <SearchBox />

      <div className="bg-main-light p-6">
        <h2 className="text-[24px] font-bold border-b-4 border-main w-fit pr-6 pb-2">
          Đã đọc gần đây
        </h2>
        {recentNovels.length === 0 && (
          <div className="text-center text-[18px] font-bold my-6">
            Bạn chưa đọc truyện nào gần đây
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mx-14 my-6">
          {recentNovels.map((novel) => (
            <div key={novel.id} className="flex justify-center">
              <Link
                to={`/book/${novel.souceNovelIds[0]?.chapterId}?source=${novel.souceNovelIds[0]?.id}`}
                className="flex flex-col items-center gap-2 max-w-[140px] my-3 cursor-pointer"
              >
                <img
                  src={novel.cover}
                  alt={novel.title}
                  className="w-36 h-48 object-cover"
                />
                <h3 className="text-[17px] font-bold text-center leading-relaxed">
                  {novel.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>

        {!isShowAllHistory && (
          <div
            onClick={() => {
              setRecentNovels(historyReading);
              setIsShowAllHistory(true);
            }}
            className="flex items-center justify-center gap-4 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-main flex justify-center items-center">
              <FaChevronDown size={22} color="#dababa" />
            </div>
            <span className="font-bold text-sub text-[18px]">Xem thêm</span>
          </div>
        )}
      </div>

      <div className="flex mt-10 p-6">
        <h2 className="text-[24px] font-bold border-b-4 border-main w-fit pr-6 pb-2">
          Đã tải về
        </h2>

        <Link to={`/downloaded`}>
          <div className="flex text-sub font-semibold transition duration-200 hover:scale-110 hover:cursor-pointer mt-1">
            <div className="text-[18px] italic ml-7 mr-3">Xem danh sách</div>

            <FaLongArrowAltRight size={20} />
          </div>
        </Link>
      </div>

      <HotNovels />
    </>
  );
}

export default Home;
