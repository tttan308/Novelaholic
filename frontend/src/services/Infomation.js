
export const getInfo = async(source,name,page) => {
    try {
        if (source == "") source = "truyenfull";
        const response = await fetch(
          `http://localhost:3001/novels?source=${source}&name=${name}&page=${page}`
        );
        console.log(`http://localhost:3001/novels?source=${source}&name=${name}&page=${page}`);
        const info = await response.json();
        return info;
      } catch (error) {
        console.log("FAILED: ", error);
        throw error;
      }
}

export const getChapter = async(next,source) => {
    try{
      if(source == "")
        source = "truyenfull"
        const response = await fetch(`http://localhost:3001` + next +`?source=${source}`);
        const json = await response.json();
        return json;
    }catch(error){
        console.log("FAILED: ", error);
        throw error;
    }
}

