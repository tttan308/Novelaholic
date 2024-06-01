
const text_font = [
    {
        name: "Times New Roman",
        value: "'Times New Roman', Times, serif",
    },
    {
        name: "Roboto",
        value: "'Roboto', sans-serif",
    },
    {
        name: "Georgia",
        value: "'Georgia', serif",
    },
    {
        name: "Courier New",
        value: "'Courier New', monospace",
    },
    {
        name: "Lucida Console",
        value: "'Lucida Console', Monaco, monospace",
    },
    {
        name: "Tahoma",
        value: "'Tahoma', sans-serif",
    },
    {
        name: "Comic Sans MS",
        value: "'Comic Sans MS', cursive",
    },
    
];

const text_size = [
    {
        name: "S",
        value: "0.75rem",
    },
    {
        name: "M",
        value: "1rem",
    },
    {
        name: "L",
        value: "1.25rem",
    },
    {
        name: "XL",
        value: "1.5rem",
    },
    {
        name: "XXL",
        value: "1.75rem",
    },
];

const line_height = [
    {
        name: "S",
        value: "1",
    },
    {
        name: "M",
        value: "1.25",
    },
    {
        name: "L",
        value: "1.5",
    },
    {
        name: "XL",
        value: "1.625",
    },
    {
        name: "XXL",
        value: "2",
    },
];

const setFont = (font) => {
    const text = document.getElementById("bookcontent-content");
    text.style.fontFamily = font;

    localStorage.setItem("font", font);
}

const setFontSize = (size) => {
    const text = document.getElementById("bookcontent-content");
    text.style.fontSize = size;

    localStorage.setItem("size", size);
}

const setBackground = (color) => {
    document.body.style.backgroundColor = color;
    document.getElementById("bookcontent-content").style.backgroundColor = color;

    localStorage.setItem("background", color);
}

const setTextColor = (color) => {
    const text = document.getElementById("bookcontent-content");
    text.style.color = color;

    //save to local storage
    localStorage.setItem("textColor", color);
}

const setLineHeight = (lineHeight) => {
    const text = document.getElementById("bookcontent-content");
    text.style.lineHeight = lineHeight;

    //save to local storage
    localStorage.setItem("lineHeight", lineHeight);
}

const getFont = () => {
    return localStorage.getItem("font") || "'Times New Roman', Times, serif";
}

const getFontSize = () => {
    return localStorage.getItem("size") || "1.25rem";
}

const getBackground = () => {
    return localStorage.getItem("background") || "#ffffff";
}

const getTextColor = () => {
    return localStorage.getItem("textColor") || "#000000";
}

const getLineHeight = () => {
    return localStorage.getItem("lineHeight") || "1.625";
}

export { text_font, text_size, line_height, setFont, setFontSize, setBackground, setTextColor, setLineHeight, getFont, getFontSize, getBackground, getTextColor, getLineHeight};