import React, { useState, useEffect } from "react";
import ReadMore from "../components/readmore";
import Pagination from "../components/pagination";
import { Link, useLocation } from "react-router-dom";
import { getChapter, getInfo } from "../services/Infomation";
import DownloadOptionModal from "./BookContent/DownloadOptionModal";
import { getSources } from "../services/content";
import { getDownloadedBookInfo } from "../services/localStorage";
import global from "../GlobalVariables";
import { findId } from "../services/novel";

const pageSize = 50;

function getGenres(genres) {
  const uniqueGenre = [];
  genres.forEach((item) => {
    if (uniqueGenre.indexOf(item.name) == -1) uniqueGenre.push(item.name);
  });
  return uniqueGenre.join(", ");
}

function BookInfo() {
  const [book, setBook] = useState({});
  const [maxPage, setMaxPage] = useState(0);
  const [genres, setGenres] = useState([]);
  const [list, setList] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sources, setSources] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [endPage, setEndPage] = useState(1);
  const [isFinish, setIsFinish] = useState(false);
  const [downloadedChapters, setDownloadedChapters] = useState([]);
  const location = useLocation();
  const [state, setState] = useState(false);
  const [foundBook, setFoundBook] = useState(true);
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
        let bookId = "";
        let newSource = -1;
        const sourceOrder = JSON.parse(localStorage.getItem("sources"));

        for (let i = 0; i < sourceOrder.length; i++) {
          bookId = await findId(sourceOrder[i].id, book.title, book.author);

          if (bookId !== "") {
            newSource = sourceOrder[i].id;
            break;
          }
        }

        if (newSource === -1) {
          window.location.href = "/";
        } else {
          let currentUrl = new URL(window.location.href);
          const newUrl = `/book/${bookId}?source=${newSource}`;
          global.currentState = 1;
          if (currentUrl.pathname + currentUrl.search !== newUrl) {
            window.location.href = newUrl;
          }
        }
      } else {
        global.currentState = 1;
        shouldRender = true;
        setState(!state);
      }
    };

    getAvailableSource();
  }

  // Lấy URL hiện tại
  const currentUrl = window.location.href;
  var from = currentUrl.indexOf("//localhost:3000/book/");
  var to = currentUrl.indexOf("?source");
  if (to == -1) to = currentUrl.length;
  if (from == -1) from = 0;
  const id = currentUrl.substring(from + "//localhost:3000/book/".length, to);
  // const id = "123";
  // Sử dụng biểu thức chính quy (regex) để lấy ID (bao gồm cả chữ và số)
  // const match = currentUrl.match(/\/book\/([a-zA-Z0-9-/-]+)/);
  // const id = match ? match[1] : null;

  useEffect(() => {
    async function restartPage() {
      const data = await getInfo(id, currentPage)
        .then((info) => {
          setFoundBook(true);
          global.currentTitle = info.title;
          global.currentAuthor = info.author;
          setBook(info);
          setMaxPage(info.maxPage);
          setGenres(getGenres(info.genres));
          setList(info.chapters);
          let size = info.chapters.length;
          let middle = size / 2;
          if (size % 2 != 0) middle++;
          setLeft(info.chapters.slice(0, middle));
          setRight(info.chapters.slice(middle, size));

          getChapter(`/novels/${id}/${1}`).then((inside) => {
            setEndPage(inside.totalChapters);
            setIsFinish(true);
          });

          // getInfo(id, info.maxPage).then((inside) => {
          //   const max = inside.chapters[inside.chapters.length - 1].title;
          //   var i =0;
          //   while(!(max[i] >= '0' && max[i] <= '9'))
          //     ++i;
          //   setEndPage(parseInt(max.substr(i, max.indexOf(":"))));
          //   setIsFinish(true);
          // });
        })
        .catch((error) => {
          setFoundBook(false);
          console.error("Error fetching book: ", error);
        });
    }
    restartPage();
  }, [currentPage]);

  useEffect(() => {
    getSources().then((res) => {
      setSources(res);
    });

    getDownloadedBookInfo(id).then((novel) => {
      if (novel) {
        setDownloadedChapters(novel.chapters);
        console.log(novel.chapters);
      }
    });
  }, []);

  if (!shouldRender) {
    return null;
  }

  isFinish && console.log(foundBook);

  if (foundBook)
    return (
      <div className="inline">
        {modalOpen && (
          <DownloadOptionModal
            sources={sources}
            bookId={id}
            setModalOpen={setModalOpen}
            chapterCount={endPage}
          />
        )}

        <div className="container px-8">
          <h1 className="text-2xl font-bold border-b-4 w-fit border-main pr-6 pb-2 pt-6">
            Thông tin truyện
          </h1>
        </div>

        <div>
          <h1 className="font-Poppins font-bold text-2xl text-main text-center pt-[15px] pb-[20px] ml-[20px] mr-[20px]">
            {book.title}
          </h1>
        </div>

        <div class="main relative">
          <div className="flex w-full">
            <div className="pl-24 pr-16">
              <img
                src={book.cover}
                alt="book image"
                width="260px"
                height="360px"
              />
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
                {isFinish && (
                  <ReadMore
                    setModalOpen={setModalOpen}
                    fullText={book.description}
                    novelId={id}
                    maxChapter={endPage}
                    authorNovel={book.author}
                  />
                )}
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

          <div className="flex mt-[36px] mb-[20px]">
            <ul className="w-[45%] ml-[40px]">
              {left.map((item, index) => {
                return (
                  <Link
                    to={`${index + (currentPage - 1) * pageSize + 1}`}
                    className=""
                  >
                    <li
                      key={index}
                      className="border-2 border-[#9F9F9F] p-[14px] bg-[#EFEFEF] flex justify-between items-center"
                    >
                      <div className="flex-grow">
                        <span className="font-Poppins font-base text-sub font-bold">
                          {item.title.indexOf("Chương") == -1 &&
                          item.title.indexOf("chương") == -1
                            ? "Chương "
                            : " "}
                          {item.title.split(":")[0]} :{" "}
                        </span>
                        <span className="">{item.title.split(":")[1]}</span>
                      </div>
                      {downloadedChapters.some(
                        (chapter) => chapter.title === "Chương " + item.title
                      ) && <span className="ml-4 text-amber-700">đã tải</span>}
                    </li>
                  </Link>
                );
              })}
            </ul>

            <ul className="w-[45%] ml-[20px]">
              {right.map((item, index) => {
                return (
                  <Link
                    to={`${
                      index + left.length + (currentPage - 1) * pageSize + 1
                    }`}
                    className=""
                  >
                    <li
                      key={index}
                      className="border-2 border-[#9F9F9F] p-[14px] bg-[#EFEFEF] "
                    >
                      <span className="font-Poppins font-base text-sub font-bold">
                        {item.title.indexOf("Chương") == -1 &&
                        item.title.indexOf("chương") == -1
                          ? "Chương "
                          : " "}
                        {item.title.split(":")[0]} :{" "}
                      </span>
                      <span className="">{item.title.split(":")[1]}</span>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
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
  else
    return (
      <div>
        <h1 className="w-[100%] h-[420px] text-center text-main text-[30px] pt-[150px]">
          <b>BOOK NOT FOUND!!!</b>
        </h1>
      </div>
    );
}

export default BookInfo;
