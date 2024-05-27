import React, { useState, useEffect } from "react";
import ReadMore from "../components/readmore";
import Pagination from "../components/pagination";
import {Link} from "react-router-dom";

const pageSize = 50

async function getInfo(source, name, page){
  try{
    if(source == "")
        source = "truyenfull.vn";
    const response = await fetch(`http://localhost:3001/novels?source=${source}&name=${name}&page=${page}`);
    const info = await response.json();
    return info
  }
  catch(error){
    console.log("FAILED: ",error);
    throw error;
  }
}

function getGenres(genres){
  const uniqueGenre = [];
  genres.forEach(item => {
    if(uniqueGenre.indexOf(item.genre) == -1)
      uniqueGenre.push(item.genre);
  });
  return uniqueGenre.join(', ');
}


function BookInfo() {
  const[book, setBook] = useState({});
  const[maxPage, setMaxPage] = useState(0);
  const[genres, setGenres] = useState([]);
  const[list,setList] = useState([]);
  const[currentPage,setCurrentPage] = useState(1);


    useEffect(() => {
      getInfo("truyenfull.vn","than-dao-dan-ton",currentPage)
      .then(info => {
        setBook(info);
        setMaxPage(info.maxPage);
        setGenres(getGenres(info.genres));
        setList(info.chapters);
      })
      .catch(error => console.error("Error fetching book: ", error));
    },[currentPage])


  return (

    <div className="inline">
      <div className="container px-8">
        <h1 className="text-2xl font-bold font-Poppins">Thông tin truyện</h1>
        <hr className="w-56 h-1 bg-main" />
      </div>

      <div>
        <h1 className="font-Poppins font-bold text-2xl text-main text-center">
          {book.title}
        </h1>
      </div>

      <div class="main relative">
        <div className="flex w-full justify-center">
          <div>
            <img src={book.cover} alt="book image"/>
          </div>
          <div className="bookDetail grid-flow-col pt-7 pl-9">
            <div className="Author grid grid-cols-8">
              <h1 className="text-base font-bold font-Poppins text-sub col-span-1">
                Tác giả
              </h1>
              <h1 className="col-span-7 content-center">{book.author}</h1>
            </div>
            <div className="Type grid grid-cols-8">
              <h1 className="text-base font-bold font-Poppins text-sub col-span-1">
                Thể loại
              </h1>
              <h1 className="col-span-7 content-center">{genres}</h1>
            </div>
            <div className="Status grid grid-cols-8">
              <h1 className="text-base font-bold font-Poppins text-sub col-span-1">
                Trạng thái
              </h1>
              <h1 className="col-span-7 content-center">{(book.status == "Full") ? "Hoàn Thành" : "Đang cập nhật"}</h1>
            </div>

            <div className="groupDesc pt-6">
              <h1 className="text-base font-bold font-Poppins text-sub">Mô tả</h1>
              <ReadMore fullText={book.description}/>
            </div>
          </div>
        </div>
      </div>
      <div className="listChapter">
        <div className="container px-8">
          <h1 className="text-2xl font-bold font-Poppins">Danh sách chương</h1>
          <hr className="w-[260px] h-1 bg-main" />
        </div>

        <table className="border-collapse ml-[50px] mt-[36px]">
            <tbody>
                {list.map((item,index) => {
                    return(
                        <Link to={{pathname: "bookContent",
                                    search: `?name=${book.title}?chapter=${item.title}`,     //pass chapter as a querry string 
                        }} className="w-1311px">

                            <tr key={index} onClick={()=>{}}>
                                {/* <td className={`border border-2 border-[#9F9F9F] p-[14px] w-[1311px] ${item.viewed === true? "bg-white" : "bg-[#EFEFEF]"} ` }> */}
                                <td className={`border border-2 border-[#9F9F9F] p-[14px] w-[1311px] bg-[#EFEFEF] ` }>

                                    <span className="font-Poppins font-base text-sub font-bold">Chương {item.title.split(':')[0]} : </span>
                                    <span className="">{item.title.split(': ')[1]}</span>
                                </td>
                            </tr>
                        </Link>
                    )
                })}
            </tbody>
        </table>

        <Pagination
            className = "pagination-bar flex justify-center pt-[15px] mb-[20px]"
            currentPage = {currentPage}
            totalPageCount = {maxPage}
            pageSize = {pageSize}
            onPageChange = {page => setCurrentPage(page)}
        />

      </div>
    </div>
  );
}

export default BookInfo;  



  // const[chapters, setChapters] = useState(initchapters);

  // update click chapter action 
  // const handleChapterClick = (chapterIndex) => {
  //   console.log("number of chapter: " , chapters.length);
  //   console.log("clicked chapter: ", chapterIndex);
  //   console.log("before click: ", chapters[chapterIndex-1].viewed);
  //   const updatedChapters = [... chapters];
  //   updatedChapters[chapterIndex-1].viewed = true;
    
  //   setChapters(updatedChapters);
  //   console.log("view in chapter click",chapters[chapterIndex-1].viewed);
  //   //update in localStorage
  //   // [...]
  // }

  // console.log(chapters);

