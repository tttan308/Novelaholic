import { useState } from "react";
import {Link} from "react-router-dom"
import ExportDialog from "./exportDialog";


const ReadMore = ({fullText}) => {
    const SEE_MORE = "See More";
    const SEE_LESS = "See Less";
    const [collapse, setCollapse] = useState(false);
    return(
        <div className="container relative">
            <div className={`content relative font-Poppins text-base max-w-[967px] pt-4 text-justify  ${collapse ? "expanded max-h-none transition-max-height duration-500" :" max-h-[7.1rem] overflow-hidden transition-max-height duration-500"}`}>
                <p dangerouslySetInnerHTML={{__html: fullText}}/>
            </div>
            <button className="flex relative justify-center w-[967px] pt-4"onClick={() => setCollapse((prev) => !prev)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6" className="size-8 border-[1px] border-solid border-full bg-main rounded-full text-white">
                    <path fill-rule="evenodd" d={!collapse ? "M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" : "M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"} clip-rule="evenodd" />
                </svg>

                <span className="font-bold font-Poppins text-basic pt-[7px] pl-2">{collapse ? SEE_LESS : SEE_MORE}</span>
            </button>
            <div className="Groupbtn flex justify-center flex-skrink-0 mt-4">
                <Link to={{pathname: "/bookContent",
                            search: `?chapter=${1}`,
                }}>
                    <button className="bg-sub text-white text-base font-inter h-[40px] w-[144px] rounded-[5px] m-[18px] transition duration-200 hover:scale-125"> Đọc từ đầu</button>
                </Link>
                <Link to={{pathname: "/bookContent",
                            search: `?chapter=last`
                }}>
                    <button className="bg-sub text-white text-base font-inter h-[40px] w-[144px] rounded-[5px] m-[18px] transition duration-200 hover:scale-125"> Đọc mới nhất</button>
                </Link>
                <button className="bg-sub text-white text-base font-inter h-[40px] w-[144px] rounded-[5px] m-[18px] transition duration-200 hover:scale-125"> Tải xuống</button>
                <ExportDialog/>
            </div>

        </div>

        );
};

export default ReadMore
