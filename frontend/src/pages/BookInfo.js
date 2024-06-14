import React, { useState, useEffect } from "react";
import ReadMore from "../components/readmore";
import Pagination from "../components/pagination";
import { Link } from "react-router-dom";
import { getInfo } from "../services/Infomation";
import DownloadOptionModal from "./BookContent/DownloadOptionModal";
import { getSources, } from "../services/content";
import {getDownloadedBookInfo} from "../services/localStorage";

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

    // Lấy URL hiện tại
    const currentUrl = window.location.href;

    // Sử dụng biểu thức chính quy (regex) để lấy ID (bao gồm cả chữ và số)
    const match = currentUrl.match(/\/book\/([a-zA-Z0-9-/-]+)/);

    const id = match ? match[1] : null;

  

    useEffect(() => {
        async function restartPage(){
            const data = await getInfo(id, currentPage)
            .then((info) => {
                setBook(info);
                setMaxPage(info.maxPage);
                setGenres(getGenres(info.genres));
                setList(info.chapters);
                let size = info.chapters.length;
                let middle = size / 2;
                if (size % 2 != 0) middle++;
                setLeft(info.chapters.slice(0, middle));
                setRight(info.chapters.slice(middle, size));

                getInfo(id,info.maxPage).then((inside) =>{
                    const max = inside.chapters[inside.chapters.length-1].title;
                    setEndPage(parseInt(max.substr(0,max.indexOf(":"))));
                    setIsFinish(true);
                })
            })
            .catch((error) => console.error("Error fetching book: ", error)); 
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
        })

    }, []);

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
                            <h1 className="col-span-7 content-center">
                                {book.author}
                            </h1>
                        </div>
                        <div className="Type grid grid-cols-8 p-[3px]">
                            <h1 className="text-base font-bold font-Poppins text-sub col-span-1">
                                Thể loại
                            </h1>
                            <h1 className="col-span-7 content-center">
                                {genres}
                            </h1>
                        </div>
                        <div className="Status grid grid-cols-8 p-[3px]">
                            <h1 className="text-base font-bold font-Poppins text-sub col-span-1">
                                Trạng thái
                            </h1>
                            <h1 className="col-span-7 content-center">
                                {book.status == "Full"
                                    ? "Hoàn Thành"
                                    : "Đang cập nhật"}
                            </h1>
                        </div>

                        <div className="groupDesc pt-6 pl-[3px]">
                            <h1 className="text-base font-bold font-Poppins text-sub">
                                Mô tả
                            </h1>
                            {isFinish && <ReadMore
                                setModalOpen={setModalOpen}
                                fullText={book.description}
                                novelId={id}
                                maxChapter={endPage}
                            />}
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
                                    to={`${
                                        index + (currentPage - 1) * pageSize + 1
                                    }`}
                                    className=""
                                >
                                    <li
                                        key={index}
                                        className="border-2 border-[#9F9F9F] p-[14px] bg-[#EFEFEF] flex justify-between items-center"
                                    >
                                        <div className="flex-grow">
                                            <span className="font-Poppins font-base text-sub font-bold">
                                                Chương {item.title.split(":")[0]} :{" "}
                                            </span>
                                            <span className="">
                                                {item.title.split(": ")[1]}
                                            </span>
                                        </div>
                                        { downloadedChapters.some(chapter => chapter.title === 'Chương ' + item.title) && 
                                            <span className="ml-4 text-amber-700">
                                                đã tải
                                            </span>}
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
                                        index +
                                        left.length +
                                        (currentPage - 1) * pageSize +
                                        1
                                    }`}
                                    className=""
                                >
                                    <li
                                        key={index}
                                        className="border-2 border-[#9F9F9F] p-[14px] bg-[#EFEFEF] "
                                    >
                                        <span className="font-Poppins font-base text-sub font-bold">
                                            Chương {item.title.split(":")[0]} :{" "}
                                        </span>
                                        <span className="">
                                            {item.title.split(": ")[1]}
                                        </span>
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
}

export default BookInfo;
