import { IoIosSearch } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchNovels } from '../services/novel';

const SearchBox = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const data = await searchNovels(searchQuery, 1, 5);
      setSearchResults(data?.slice(0, 5));
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  return (
    <div className="flex justify-end py-10">
      <div className="w-[500px] flex border rounded-md px-2 py-[6px] gap-2 mr-6 relative">
        <IoIosSearch size={22} color="#555" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              navigate(`/search?keyword=${searchQuery}`);
            }
          }}
          placeholder="Nhập tên truyện hoặc tác giả"
          className="text-sm flex-1"
        />
        {searchResults?.length > 0 && (
          <div
            className="absolute bg-white w-full rounded-md shadow-md top-12 right-0"
            onClick={() => setSearchResults([])}
          >
            {searchResults.map((novel) => (
              <div
                key={novel.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b"
                onClick={() => navigate(`/novel/${novel.id}`)}
              >
                {novel.title}
              </div>
            ))}
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-1"
              onClick={() => navigate(`/search?keyword=${searchQuery}`)}
            >
              <span className="italic text-sm">Xem thêm truyện khác</span>
              <IoIosSearch size={22} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
