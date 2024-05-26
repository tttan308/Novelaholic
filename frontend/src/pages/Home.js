import { FaChevronDown } from "react-icons/fa";
import HotNovels from "../components/HotNovels";
import SearchBox from "../components/SearchBox";

function Home() {
  const recentlyBooks = [
    {
      id: 1,
      title: "Nàng không muốn làm hoàng hậu",
      image: "https://images.penguinrandomhouse.com/cover/9780316760113",
    },
    {
      id: 2,
      title: "Nàng không muốn làm hoàng hậu",
      image: "https://images.penguinrandomhouse.com/cover/9780316760113",
    },
    {
      id: 3,
      title: "Nàng không muốn làm hoàng hậu",
      image: "https://images.penguinrandomhouse.com/cover/9780316760113",
    },
    {
      id: 4,
      title: "Nàng không muốn làm hoàng hậu",
      image: "https://images.penguinrandomhouse.com/cover/9780316760113",
    },
    {
      id: 5,
      title: "Nàng không muốn làm hoàng hậu",
      image: "https://images.penguinrandomhouse.com/cover/9780316760113",
    },
  ];

  return (
    <>
      <SearchBox />
      <div className="bg-main-light p-6">
        <h2 className="text-lg font-semibold border-b-4 border-main w-fit">
          Đã đọc gần đây
        </h2>
        <div className="flex justify-around mx-14 my-6">
          {recentlyBooks.map((book) => (
            <div
              key={book.id}
              className="flex flex-col items-center gap-2 max-w-[140px] my-3 cursor-pointer"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-28 h-36 object-cover"
              />
              <h3 className="text-sm font-semibold text-center">
                {book.title}
              </h3>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-main flex justify-center items-center">
            <FaChevronDown size={22} color="#dababa" />
          </div>
          <span className="font-semibold">Xem thêm</span>
        </div>
      </div>
      <HotNovels />
    </>
  );
}

export default Home;
