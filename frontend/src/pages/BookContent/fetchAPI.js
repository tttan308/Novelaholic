import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const getChapter = async (id, chapter) => {
    try{
        const response = await axios.get(`${apiURL}/book/${id}/${chapter}`);
        return response.data;
    }
    catch(error){
        console.log("Get chapter failed: ", error);
    }
};  

export const getBook = async (id) => {
    try{
        const response = await axios.get(`${apiURL}/book/${id}`);
        return response.data;
    }
    catch(error){
        console.log("Get book failed: ", error);
    }
};
