import React, { useState, useEffect, Component, useMemo } from "react";
import {Link} from "react-router-dom";
import Pagination from "../components/pagination"

let pageSize = 7;
const ListChapter = ({data, clickAction}) => {
    const[chapters, setChapters] = useState(data);
    const[currentPage,setCurrentPage] = useState(1);


    const currentTableData = useMemo(()=>{
        const firstPageIndex = (currentPage - 1) *pageSize;
        const lastPageIndex = firstPageIndex + pageSize;
        return data.slice(firstPageIndex,lastPageIndex);
    },[currentPage])
  
    
    return(
        <>
        
            <table className="border-collapse ml-[50px] mt-[36px]">
                <tbody>
                    {currentTableData.map((item,index) => {
                        return(
                            <Link to={{pathname: "bookContent",
                                        search: `?chapter=${item.chapter}`,     //pass chapter as a querry string 
                            }} className="w-1311px">

                                <tr key={index} onClick={() =>  clickAction(item.chapter)}>
                                    <td className={`border border-2 border-[#9F9F9F] p-[14px] w-[1311px] ${item.viewed === true? "bg-white" : "bg-[#EFEFEF]"} ` }>
                                        <span className="font-Poppins font-base text-sub font-bold">Chương {item.chapter} : </span>
                                        <span className="">{item.title}</span>
                                    </td>
                                </tr>
                            </Link>
                        )
                    })}
                </tbody>
            </table>

            <Pagination
                className = "pagination-bar flex justify-center pt-[15px]"
                currentPage = {currentPage}
                totalCount = {data.length}
                pageSize = {pageSize}
                onPageChange = {page => setCurrentPage(page)}
            />
            
        </>
    )
}

export default ListChapter;