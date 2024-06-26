import { IoIosSearch } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { searchNovels } from "../services/novel";
import { fetchGenres } from "../services/genre";
import { getGenreFromHref } from "../utils/genre";

const SearchBox = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { genre } = useParams();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(genre || "");

  useEffect(() => {
    const query = searchParams.get("keyword");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  useEffect(() => {
    if (genre) {
      setSelectedGenre(genre);
    }
  }, [genre]);

  useEffect(() => {
    const query = searchParams.get("keyword");
    if (query === searchQuery) {
      setSearchResults([]);
      return;
    }

    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      const { data } = await searchNovels(searchQuery, 1);
      setSearchResults(data?.slice(0, 5));
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery, searchParams]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchGenres();
      setGenres(data.filter((genre) => genre.name !== "Tất cả"));
    };

    getData();
  }, []);

  const queryParams = new URLSearchParams(location.search);
  const sourceParam = queryParams.get("source");

  return (
    <div className="flex justify-between my-10 px-6">
      <div className="flex items-center h-full gap-4">
        <span className="text-sub text-[18px] font-bold">Thể loại</span>
        <select
          className="block bg-white border border-gray-300 h-10 px-4 py-2 focus:outline-none focus:border-sub"
          onChange={(e) => {
            if (e.target.value === "") {
              navigate(`/?source=${sourceParam}`);
              return;
            }
            navigate(`/category/${e.target.value}?source=${sourceParam}`);
          }}
          value={selectedGenre}
        >
          <option value="">Tất cả</option>
          {genres.map((genre) => {
            return (
              <option key={genre.href} value={getGenreFromHref(genre.href)}>
                {genre.name}
              </option>
            );
          })}
        </select>
      </div>
      <div
        className="border border-gray-400 w-[500px] flex rounded-md px-2 py-[6px] gap-2 mr-6 relative"
        ref={searchRef}
      >
        <IoIosSearch size={22} color="#555" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              navigate(`/search?keyword=${searchQuery}&source=${sourceParam}`);
            }
          }}
          placeholder="Nhập tên truyện hoặc tác giả"
          className="flex-1"
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
                onClick={() =>
                  navigate(`/book/${novel.id}?source=${sourceParam}`)
                }
              >
                {novel.title}
              </div>
            ))}
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-1"
              onClick={() =>
                navigate(`/search?keyword=${searchQuery}&source=${sourceParam}`)
              }
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
