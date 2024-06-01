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

export const getBook = async (id, chapterList) => {
    try {
        const bookResponse = await axios.get(`${apiURL}/book/${id}`);
        const { novelId, novelTitle, chapterCount, source, coverImage, genres, description } = bookResponse.data;
    
        chapterList = chapterList || Array.from({ length: chapterCount }, (_, i) => i + 1);
        
        const chapterPromises = [];
        chapterList.forEach(chapter => {
            chapterPromises.push(axios.get(`${apiURL}/book/${id}/${chapter}`));
        });

        const chapterResponses = await Promise.all(chapterPromises);
    
        const chapters = chapterResponses.map(response => ({
            chapterTitle: response.data.chapterTitle,
            chapterContent: response.data.chapterContent,
            chapterNumber: response.data.chapterNumber
        }));

        //get cover image
        const coverResponse = await axios.get(coverImage);
        const cover = coverResponse.data;

    
        return {
            novelId,
            novelTitle,
            genres,
            cover,
            description,
            chapterCount,
            source,
            chapters
        };
        
      } catch (error) {
        console.error('Error fetching book data:', error);
      }
};
