import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

export default function ExportDialog() {
  const [visible, setVisible] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);

  //xử lý từng nút chọn
  const handleButtonClick = (format) => {
    //export file in particular format
    // [...]
    setSelectedFormat(format);
    setVisible(false); // close dialog
  };

  return (
    <div className="card flex justify-content-center">
      <Button
        label="Xuất"
        onClick={() => setVisible(true)}
        className="font-semibold bg-sub text-white text-base font-inter h-[40px] w-[144px] rounded-[5px] m-[18px] transition duration-200 hover:scale-125"
      />
      <Dialog
        className="drop-shadow-2xl w-[40%] h-[20%] bg-sub text-white shadow-2xl rounded-md p-2"
        model="false"
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <div className="m-0 bg-sub w-[100%] h-[100%] rounded-lg">
          <h1 className="text-[30px] text-white font-bold text-center p-[10px]">
            Chọn định dạng xuất file
          </h1>
          <div className="group flex justify-center">
            <Button
              label="PDF"
              className="pt-[10px] pb-[10px] pl-[20px] pr-[20px] bg-main rounded-[5px] m-[10px] text-white transition duration-200 hover:scale-125"
              onClick={() => handleButtonClick("PDF")}
            />
            <Button
              label="PRC"
              className="pt-[10px] pb-[10px] pl-[20px] pr-[20px] bg-main rounded-[5px] m-[10px] text-white transition duration-200 hover:scale-125"
              onClick={() => handleButtonClick("PRC")}
            />
            <Button
              label="EPUB"
              className="pt-[10px] pb-[10px] pl-[20px] pr-[20px] bg-main rounded-[5px] m-[10px] text-white transition duration-200 hover:scale-125"
              onClick={() => handleButtonClick("EPUB")}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
