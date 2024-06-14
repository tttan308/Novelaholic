const apiURL = process.env.REACT_APP_API_URL;


export const getInfo = async (name, page) => {
    try {
        const response = await fetch(
            `${apiURL}/novels?name=${name}&page=${page}`
        );
        // console.log(`${apiURL}/novels?name=${name}&page=${page}`);
        const info = await response.json();

        return info;
    } catch (error) {
        console.log("FAILED: ", error);
        throw error;
    }
};

export const getChapter = async (next) => {
    try {
        const response = await fetch(`${apiURL}` + next);
        const json = await response.json();
        return json;
    } catch (error) {
        console.log("FAILED: ", error);
        throw error;
    }
};

export const getExportType = async() => {
    try{
        const response = await fetch(`${apiURL}/export`);
        const json = await response.json();
        return json;
    }catch(error){
        console.log("FAILED: ",  error);
        throw error;
    }
} 
