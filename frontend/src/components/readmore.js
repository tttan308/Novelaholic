import { useEffect, useState } from "react";
import { Link, json } from "react-router-dom";
import { getChapter, getInfo, getExportType } from "../services/Infomation";
import { getBookHistoryChapter } from "../services/localStorage";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import axios from "axios";
import { saveAs } from "file-saver";
const apiURL = process.env.REACT_APP_API_URL;


async function download(novelId, beginChapter, endChapter, id, author) {
    console.log("Start download!!!");

    //create data 
    var chapters = [];
    let next = `/novels/${novelId}/${beginChapter}`;
    var novelTitle = "";
    let i;
    let pos = beginChapter;
    while(pos <= endChapter){
        const json = await getChapter(next);
        next = json.nextChapter;
        novelTitle =json.novelTitle;
        chapters.push({chapterContent: json.chapterContent, chapterTitle: json.chapterTitle});
        ++pos;
    }
    const data= {
        id: id, 
        author: author, 
        novelTitle: novelTitle, 
        chapters: chapters
    };

    axios.create({
        baseURL: 'http://localhost:3001/export',
        timeout: 600000,
        responseType: 'blob',
    })
    .post('http://localhost:3001/export',data)
    .then(res => {
        var file_data = res["data"];
        var file_type = res["headers"]["content-type"];
        var file_name = data.novelTitle + "." +file_type;
        var blob = new Blob([file_data], {type: file_type});
        saveAs(blob,file_name);
        console.log("download finish!!!");
    })
    .catch(error => {
        console.log("FAILED: ", error); 
    })
}

const Overlay = () => {
    return (
        <div id="overlay" className="fixed bottom-[10px] right-[40px] text-sub "> <b>Downloading... </b></div>
    )
}




const ReadMore = ({ fullText, novelId, setModalOpen , maxChapter, authorNovel}) => {
    const SEE_MORE = "Xem thêm";
    const SEE_LESS = "Thu gọn";
    const [collapse, setCollapse] = useState(false);
    const [lastChapter, setLastChapter] = useState(1);
    const [chaptersHistory, setChaptersHistory] = useState([]);
    const [visible, setVisible] = useState(false);
    const [beginChapter, setBeginChapter] = useState(1);
    const [chapters, setChapters] = useState(0);
    const [types, setType] = useState([{}]);
    const [isFinish, setIsFinish] = useState(false);
    const [author, setAuthor] = useState("");
    const [onDownloading, setOnDownloading] = useState(false);

    
    useEffect(() => {
        //get last chapter
        const getLast = async () => {
            setLastChapter(maxChapter);
            setChapters(maxChapter);
        };
        getLast();
        // get export type
        getExportType().then(data => {
            setType(data);
        })
        setAuthor(authorNovel);
        setChaptersHistory(getBookHistoryChapter(novelId));
        setIsFinish(true);
    }, []);
    
   

    const handleButtonClick = async (id) => {
        setVisible(false); // close dialog
        if (beginChapter > lastChapter) {
            alert("chương bắt đầu không được lớn hơn chương kết thúc");
        } else {
            setOnDownloading(true);
            await download(novelId, beginChapter, lastChapter, id, author);
            setOnDownloading(false);
        }
        setBeginChapter(1);
        setLastChapter(chapters);
    };

    const handleFromChapterChange = (event) => {
        setBeginChapter(parseInt(event.target.value));
    };

    const handleToChapterChange = (event) => {
        setLastChapter(parseInt(event.target.value));
    };
    


    return (
        <div className="container relative">
            <div
                className={`content relative font-Poppins text-base mr-[50px] max-w-[967px] pt-4 text-justify  ${
                    collapse
                        ? "expanded max-h-none transition-max-height duration-500"
                        : " max-h-[7.1rem] overflow-hidden transition-max-height duration-500"
                }`}
            >
                <p dangerouslySetInnerHTML={{ __html: fullText }} />
            </div>
            <button
                className="flex relative justify-center w-[967px] pt-4"
                onClick={() => setCollapse((prev) => !prev)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6"
                    className="size-8 border-[1px] border-solid border-full bg-main rounded-full text-white"
                >
                    <path
                        fill-rule="evenodd"
                        d={
                            !collapse
                                ? "M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                                : "M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
                        }
                        clip-rule="evenodd"
                    />
                </svg>

                <span className="font-bold font-Poppins text-sub text-basic pt-[10px] pl-2">
                    {collapse ? SEE_LESS : SEE_MORE}
                </span>
            </button>
            <div className="Groupbtn flex justify-center flex-skrink-0 mt-4">
                <Link to={`1`}>
                    <button className="font-semibold bg-sub text-white text-base font-inter h-[40px] w-[144px] rounded-[5px] m-[18px] transition duration-200 hover:scale-125">
                        {" "}
                        Đọc từ đầu
                    </button>
                </Link>
                <Link to={`${lastChapter}`}>
                    <button className="font-semibold bg-sub text-white text-base font-inter h-[40px] w-[144px] rounded-[5px] m-[18px] transition duration-200 hover:scale-125">
                        {" "}
                        Đọc mới nhất
                    </button>
                </Link>
                {chaptersHistory.length > 0 && (
                    <Link to={`${chaptersHistory[chaptersHistory.length - 1]}`}>
                        <button className="font-semibold bg-sub text-white text-base font-inter h-[40px] w-[144px] rounded-[5px] m-[18px] transition duration-200 hover:scale-125">
                            {" "}
                            Đọc tiếp
                        </button>
                    </Link>
                )}

                <button
                    onClick={() =>
                        setTimeout(() => {
                            setModalOpen(true);
                        }, 0)
                    }
                    className="font-semibold bg-sub text-white text-base font-inter h-[40px] w-[144px] rounded-[5px] m-[18px] transition duration-200 hover:scale-125"
                >
                    {" "}
                    Tải xuống
                </button>
                <div className="card flex justify-content-center">
                    <Button
                        label="Xuất"
                        onClick={() => setVisible(true)}
                        className="font-semibold bg-sub text-white text-base font-inter h-[40px] w-[144px] rounded-[5px] m-[18px] transition duration-200 hover:scale-125"
                    />
                    <Dialog
                        className="drop-shadow-2xl w-[40%] h-[37%] bg-sub text-white shadow-2xl rounded-md p-2"
                        model="false"
                        visible={visible}
                        onHide={() => setVisible(false)}
                    >
                        <div className="m-0 bg-sub w-[100%] h-[100%] rounded-lg">
                            <h1 className="text-[25px] text-white font-bold text-center p-[20px]">
                                Chọn danh sách chương muốn xuất
                            </h1>
                            <div className="group flex justify-center">
                                <p className="p-[10px]">Từ chương: </p>
                                <select
                                    className="block bg-white border border-gray-300 h-10 px-4 py-2 focus:outline-none focus:border-blue-500 text-black"
                                    defaultValue={1}
                                    onChange={handleFromChapterChange}
                                >
                                    {[...Array(chapters).keys()].map((index) => (
                                        <option key={index} value={index + 1}>
                                            Chương {index + 1}
                                        </option>
                                    ))}
                                </select>
                                <p className="p-[10px]">Đến chương: </p>
                                <select
                                    className=" block bg-white border border-gray-300 h-10 px-4 py-2 focus:outline-none focus:border-blue-500 text-black"
                                    defaultValue={chapters}
                                    onChange={handleToChapterChange}
                                >
                                    {[...Array(chapters).keys()].map((index) => (
                                        <option key={index} value={index + 1}>
                                            Chương {index + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <h1 className="text-[25px] text-white font-bold text-center p-[10px] mt-[20px]">
                                Chọn định dạng xuất file
                            </h1>

                            <div className="group flex justify-center">
                                {isFinish && types.map((type, index) => {
                                    return(
                                    <Button
                                        label={type.type}
                                        className="pt-[10px] pb-[10px] pl-[20px] pr-[20px] bg-main rounded-[5px] m-[10px] text-white transition duration-200 hover:scale-125"
                                        onClick={() => handleButtonClick(type.id)}
                                    />
                                    )
                                })}
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
            {onDownloading && <Overlay/>}
        </div>
    );
};

export default ReadMore;


