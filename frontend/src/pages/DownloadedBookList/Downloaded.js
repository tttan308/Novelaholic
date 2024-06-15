import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDownloadedBookCardInfo } from "../../services/localStorage";

const DownloadedPage = () => {
  const [downloadNovels, setDownloadNovels] = useState([]);

  useEffect(() => {
    getDownloadedBookCardInfo().then((books) => {
      setDownloadNovels(books);
      console.log(books);
    });
  }, []);

  return (
    <div className="bg-main-light p-6">
      <h2 className="text-[24px] font-bold border-b-4 border-main w-fit pr-6 pb-2">
        Truyện đã tải
      </h2>
      {downloadNovels.length === 0 && (
        <p className="text-center text-[18px] font-bold my-6">
          Chưa có truyện nào được tải
        </p>
      )}
      <div className="flex justify-around mx-14 my-6">
        {downloadNovels.map((novel) => (
          <div key={novel.id} className="flex justify-center">
            <Link
              to={`/book/${novel.id}`}
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
              <div className="h-6">
                <p className="text-[14px] font-bold text-center text-sub">
                  Đã tải {novel.chapterCount} chương
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadedPage;
