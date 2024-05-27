import { useParams } from 'react-router-dom';
import SearchBox from '../components/SearchBox';
import { useEffect, useState } from 'react';
import { searchByGenre } from '../services/novel';
import { FaChevronDown } from 'react-icons/fa';

const GenrePage = () => {
  const { genre } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(20);
  const [total, setTotal] = useState(1);

  useEffect(() => {
    const getData = async () => {
      const { data, total } = await searchByGenre(genre, page);
      if (!data) return;
      setSearchResults([...searchResults, ...data]);
      setTotal(total);
    };
    getData();
  }, [page]);

  useEffect(() => {
    setPage(1);
    setOffset(20);
    const getData = async () => {
      const { data, total } = await searchByGenre(genre, page);
      if (!data) return;
      setSearchResults(data);
      setTotal(total);
    };
    getData();
  }, [genre]);

  const handleViewMore = () => {
    setOffset(offset + 20);
    if (searchResults.length < offset + 20) {
      setPage(page + 1);
    }
  };

  const novels = searchResults?.slice(0, offset);
  const showViewMore =
    page < total || (page === total && offset < searchResults.length);

  return (
    <>
      <SearchBox />
      <div className="p-6 my-4">
        {searchResults.length === 0 ? (
          <div className="text-center my-10">
            Không tìm được truyện thuộc thể loại: {genre.toUpperCase()}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-5 justify-between mx-14 my-6">
              {novels?.map((novel) => (
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

            {showViewMore && (
              <div
                className="flex items-center justify-center gap-4 cursor-pointer"
                onClick={handleViewMore}
              >
                <div className="w-8 h-8 rounded-full bg-main flex justify-center items-center">
                  <FaChevronDown size={22} color="#dababa" />
                </div>
                <span className="font-semibold">Xem thêm</span>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default GenrePage;
