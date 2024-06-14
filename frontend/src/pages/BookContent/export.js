import { Dialog } from "primereact/dialog";
import React, { useEffect,  useState } from "react";
import { Button } from "primereact/button";
import saveAs from "file-saver";
import { FaFileExport } from "react-icons/fa";
import { getChapter, getInfo, getExportType } from "../../services/Infomation";
import axios from "axios";




async function download(novelId, chapter, typeId){
    //prepare data 
    const info = await getInfo(novelId,1);

    const request = `/novels/${novelId}/${chapter}`;
    const content = await getChapter(request);

    const data = {
        id: typeId,
        author: info.author,
        novelTitle: info.title,
        chapters:[
            {
                chapterTitle: content.chapterTitle,
                chapterContent: content.chapterContent
            }
        ]
    }

    //download file 
    axios.create({
        baseURL: 'http://localhost:3001/export',
        timeout: 600000,
        responseType: 'blob',
    }).post('http://localhost:3001/export',data)
    .then(res => {
        var file_data = res["data"];
        var file_type = res["headers"]["content-type"];
        var file_name = data.novelTitle + "." +file_type;
        var blob = new Blob([file_data], {type: file_type});
        saveAs(blob,file_name);
    })
    .catch(error =>{
        console.log('FAILED: ', error);
        throw error;
    });

}

const Overlay = () => {
    return (
        <div id="overlay" className="fixed bottom-[-35px] left-[0px] text-main "> Downloading... </div>
    )
}



export default function ExportButton({ novelId, chapter }) {
    const [visible, setVisible] = useState(false);
    const [types, setTypes] = useState([]);
    const [onDownloading, setOnDownloading] = useState(false);

    useEffect(() => {
        getExportType().then(data => {
            setTypes(data);
        })
    },[]);

    const handleButtonClick = async (format) => {
        setVisible(false); // close dialog
        setOnDownloading(true);
        await download(novelId,chapter,format);
        setOnDownloading(false);
    };

    return (
        <div className="card flex justify-content-center">
            <button
                className="text-main hover:text-black"
                onClick={() => setVisible(true)}
            >
                <FaFileExport size={24} />
            </button>
            <Dialog
                className="drop-shadow-2xl w-[40%] h-[25%] bg-sub text-white shadow-2xl rounded-md p-2"
                model="false"
                visible={visible}
                onHide={() => setVisible(false)}
            >
                <div className="m-0 bg-sub w-[100%] h-[100%] rounded-lg">
                    <h1 className="text-[25px] text-white font-bold text-center p-[10px] ">
                        Chọn định dạng xuất file
                    </h1>

                    <div className="group flex justify-center">
                        {types.map((type,index) => {
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
            {onDownloading && <Overlay/>}
            
        </div>
    );
}
