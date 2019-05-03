import axios from "axios";

export const GetData = (func, data) => {
  switch (func) {
    case "loadtime":
      loadTime(data);
      break;
    case "size":
      RequestSize(data);
      break;
    default:
      break;
  }
};

async function loadTime(data) {
  const getTime = async () => {
    var start = Date.now();
    try {
      await axios.get("http://127.0.0.1:8080/");
    } catch (e) { return -1}
    return Date.now() - start;
  };

  data.push([new Date(Date.now()).toString().substr(16, 8), await getTime()]);
}

async function RequestSize(data) {
    const getSize = async () => {
        try {
          const res = await axios.get("http://127.0.0.1:8080/");
          return JSON.stringify(res.data).length;
        } catch (e) { return -1;}
      };
    
      data.push([new Date(Date.now()).toString().substr(16, 8), await getSize()]);
}