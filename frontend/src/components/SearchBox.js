import { IoIosSearch } from 'react-icons/io';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchNovels } from '../services/novel';

const SearchBox = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const { data, total } = await searchNovels(searchQuery, 1);
      setSearchResults(data?.slice(0, 5));
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-end my-10">
      <div
        className="w-[500px] flex border rounded-md px-2 py-[6px] gap-2 mr-6 relative"
        ref={searchRef}
      >
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
