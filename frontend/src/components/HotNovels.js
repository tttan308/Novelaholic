import { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { fetchHotNovels } from '../services/novel';

const HotNovels = () => {
  const [hotNovels, setHotNovels] = useState([]);
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(10);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchHotNovels(page);
      setHotNovels([...hotNovels, ...data]);
    };
    getData();
  }, [page]);

  const handleViewMore = () => {
    setOffset(offset + 10);
    if (hotNovels.length < offset + 10) {
      setPage(page + 1);
    }
  };

  const novels = hotNovels.slice(0, offset);

  return (
    <div className="p-6 my-4">
      <h2 className="text-lg font-semibold border-b-4 border-main w-fit">
        Truyện hot
      </h2>
      <div className="grid grid-cols-5 justify-between mx-14 my-6">
        {novels.map((novel) => (
          <div key={novel.id} className="flex justify-center">
            <div className="flex flex-col items-center gap-2 max-w-[140px] my-3 cursor-pointer">
              <img
                src={novel.cover}
                alt={novel.title}
                className="w-28 h-36 object-cover"
              />
              <h3 className="text-sm font-semibold text-center">
                {novel.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
      <div
        className="flex items-center justify-center gap-4 cursor-pointer"
        onClick={handleViewMore}
      >
        <div className="w-8 h-8 rounded-full bg-main flex justify-center items-center">
          <FaChevronDown size={22} color="#dababa" />
        </div>
        <span className="font-semibold">Xem thêm</span>
      </div>
    </div>
  );
};

export default HotNovels;
