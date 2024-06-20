import {
  text_font,
  text_size,
  line_height,
  setFont,
  setFontSize,
  setBackground,
  setTextColor,
  setLineHeight,
  getFont,
  getFontSize,
  getBackground,
  getTextColor,
  getLineHeight,
} from "./textConfig";

import { React, useState } from "react";

const SettingBox = () => {
  const [fontState, setFontFamilyState] = useState(getFont());
  const [fontSizeState, setFontSizeState] = useState(getFontSize());
  const [lineHeightState, setLineHeightState] = useState(getLineHeight());

  return (
    <div className="fixed left-20 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-lg border-4 w-64">
      <h3 className="font-bold mb-4 text-[18px]">Cài đặt</h3>
      <div className="mb-4">
        <label className="block mb-2">Font chữ</label>
        <select
          className="w-full border border-gray-300 p-2"
          onChange={(e) => {
            setFont(e.target.value);
            setFontFamilyState(e.target.value);
          }}
          value={fontState}
        >
          {text_font.map((font, index) => (
            <option key={index} value={font.value}>
              {font.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Kích thước chữ</label>
        <select
          className="w-full border border-gray-300 p-2"
          onChange={(e) => {
            setFontSize(e.target.value);
            setFontSizeState(e.target.value);
          }}
          value={fontSizeState}
        >
          {text_size.map((size, index) => (
            <option key={index} value={size.value}>
              {size.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Khoảng cách dòng</label>
        <select
          className="w-full border border-gray-300 p-2"
          onChange={(e) => {
            setLineHeight(e.target.value);
            setLineHeightState(e.target.value);
          }}
          value={lineHeightState}
        >
          {line_height.map((height, index) => (
            <option key={index} value={height.value}>
              {height.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Màu chữ</label>
        <input
          type="color"
          onChange={(e) => setTextColor(e.target.value)}
          defaultValue={getTextColor()}
        ></input>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Màu nền</label>
        <input
          type="color"
          onChange={(e) => setBackground(e.target.value)}
          defaultValue={getBackground()}
        ></input>
      </div>
    </div>
  );
};

export default SettingBox;
