import React from "react";
import classnames from "classnames"
import { usePagination, DOTS } from "./usePagination";
import "./pagination.css"

const Pagination = props => {
    const{
        onPageChange,
        // totalCount,
        totalPageCount,
        siblingCount = 1,
        currentPage,
        pageSize,
        className
    } = props;
    const paginationRange = usePagination({
        currentPage,
        // totalCount,
        totalPageCount,
        siblingCount,
        pageSize
    });
    if(currentPage === 0 || paginationRange.length < 2){
        return null;
    }
    const onNext = () => {
        onPageChange(currentPage + 1);
    }

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    }

    let lastPage = paginationRange[paginationRange.length - 1];
    return(
        <ul className={classnames('pagination-container',{[className]: className})}>
            
            <li className={classnames('pagination-item',{disabled:currentPage === 1})} onClick={()=> onPageChange(1)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                  </svg>
            </li>

            <li className={classnames('pagination-item',{disabled:currentPage === 1})} onClick={onPrevious}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

            </li>
            {paginationRange.map(pageNumber => {
                if (pageNumber === DOTS){
                    return <li className = "pagination-item dots">&#8230;</li> ;
                }
                return(
                    <li className = {classnames('pagination-item',{selected: pageNumber === currentPage})} onClick={() => onPageChange(pageNumber)}>
                        {pageNumber}
                    </li>
                );
            })}
            <li className = {classnames('pagination-item',{ disabled: currentPage === lastPage})} onClick={onNext}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>

            </li>
            <li className={classnames('pagination-item',{disabled:currentPage === lastPage})} onClick={()=> onPageChange(lastPage)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                </svg>

            </li>
        </ul>
    );
};

export default Pagination;

