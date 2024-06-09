import React, { useState, useEffect } from "react";
import ReadMore from "../../components/readmore";
import Pagination from "../../components/pagination";
import { Link } from "react-router-dom";

const pageSize = 50;

async function getInfo(source, name, page) {
    //getInfo in indexedDB
    const request = indexedDB.open("books", 1);
    let book = {};
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("books", "readwrite");
        const objectStore = transaction.objectStore("books");
        const request = objectStore.get(name);
        request.onsuccess = (event) => {
            book = event.target.result;
        };
    };
    request.onerror = (event) => {
        return false;
    }
    return book;
}


function BookInfo() {
  const [book, setBook] = useState({});
  const [maxPage, setMaxPage] = useState(0);
  const [genres, setGenres] = useState([]);
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // Lấy URL hiện tại
  const currentUrl = window.location.href;
  console.log("currrent url: ", currentUrl);

  // Sử dụng biểu thức chính quy (regex) để lấy ID (bao gồm cả chữ và số)
  const match = currentUrl.match(/\/book\/([a-zA-Z0-9-/-]+)/);

  const id = match ? match[1] : null;

  if (id !== null) {
    console.log(`ID là: ${id}`); // Xuất ra ID nếu tìm thấy
  } else {
    console.log("Không tìm thấy ID trong URL"); // Thông báo nếu không tìm thấy
  }

  useEffect(() => {
    getInfo("truyenfull", id, currentPage)
      .then((info) => {
        setBook(info);
        setMaxPage(info.maxPage);
        setGenres(getGenres(info.genres));
        setList(info.chapters);
      })
      .catch((error) => console.error("Error fetching book: ", error));
  }, [currentPage]);

  return (
    <div className="inline">
      <div className="container px-8">
        <h1 className="text-2xl font-bold border-b-4 w-fit border-main pr-6 pb-2 pt-6">
          Thông tin truyện
        </h1>
      </div>

      <div>
        <h1 className="font-Poppins font-bold text-2xl text-main text-center">
          {book.title}
        </h1>
      </div>

      <div class="main relative">
        <div className="flex w-full">
          <div className="pl-24 pr-16">
            <img src={book.cover} alt="book image" />
          </div>
          <div className="bookDetail grid-flow-col pt-7 pl-9">
            <div className="Author grid grid-cols-8 p-[3px]">
              <h1 className="text-base font-bold font-Poppins text-sub col-span-1">
                Tác giả
              </h1>
              <h1 className="col-span-7 content-center">{book.author}</h1>
            </div>
            <div className="Type grid grid-cols-8 p-[3px]">
              <h1 className="text-base font-bold font-Poppins text-sub col-span-1">
                Thể loại
              </h1>
              <h1 className="col-span-7 content-center">{genres}</h1>
            </div>
            <div className="Status grid grid-cols-8 p-[3px]">
              <h1 className="text-base font-bold font-Poppins text-sub col-span-1">
                Trạng thái
              </h1>
              <h1 className="col-span-7 content-center">
                {book.status == "Full" ? "Hoàn Thành" : "Đang cập nhật"}
              </h1>
            </div>

            <div className="groupDesc pt-6 pl-[3px]">
              <h1 className="text-base font-bold font-Poppins text-sub">
                Mô tả
              </h1>
              <ReadMore fullText={book.description} novelId={id}/>
            </div>
          </div>
        </div>
      </div>
      <div className="listChapter">
        <div className="container px-8">
          <h1 className="text-2xl font-bold font-Poppins mt-4 border-b-4 w-fit border-main pr-6 pb-2">
            Danh sách chương
          </h1>
        </div>

        <table className="border-collapse ml-[50px] mt-[36px] mb-[20px]">
          <tbody>
            {list.map((item, index) => {
              return (
                <Link
                  to={{
                    pathname: "bookContent",
                    search: `?name=${id}?chapter=${item.title}`, //pass chapter as a querry string
                  }}
                  className="w-1311px"
                >
                  <tr key={index} onClick={() => {}}>
                    {/* <td className={`border border-2 border-[#9F9F9F] p-[14px] w-[1311px] ${item.viewed === true? "bg-white" : "bg-[#EFEFEF]"} ` }> */}
                    <td
                      className={` border-2 border-[#9F9F9F] p-[14px] w-[1311px] bg-[#EFEFEF] `}
                    >
                      <span className="font-Poppins font-base text-sub font-bold">
                        Chương {item.title.split(":")[0]} :{" "}
                      </span>
                      <span className="">{item.title.split(": ")[1]}</span>
                    </td>
                  </tr>
                </Link>
              );
            })}
          </tbody>
        </table>

        <Pagination
          className="pagination-bar flex justify-center pt-[15px] mb-[20px]"
          currentPage={currentPage}
          totalPageCount={maxPage}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

export default BookInfo;
