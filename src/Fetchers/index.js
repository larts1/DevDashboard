import axios from "axios";

export const GetData = (func, data, options) => {
  switch (func) {
    case "loadtime":
      loadTime(data, options);
      break;
    case "size":
      RequestSize(data, options);
      break;
    case "status":
      GetStatus(data, options);
      break;
    default:
      break;
  }
};

async function loadTime(data, options) {
  const getTime = async () => {
    var start = Date.now();
    try {
      await axios.get(options.url, {crossdomain: true});
    } catch (e) { return -1}
    return Date.now() - start;
  };

  data.push([new Date(Date.now()).toString().substr(16, 8), await getTime()]);
}

async function RequestSize(data, options) {
    const getSize = async () => {
        try {
          const res = await axios.get(options.url, {crossdomain: true});
          return JSON.stringify(res.data).length;
        } catch (e) { return -1;}
      };
    
      data.push([new Date(Date.now()).toString().substr(16, 8), await getSize()]);
}

async function GetStatus(data, options) {
    const getStatus = async () => {
      try {
        const res = await axios.get(options.url, {crossdomain: true});
        return res.status;
      } catch (e) { return e.response && e.response.status}
    };
    const code = ((await getStatus()) || "500").toString();
    const currEle = data.find(e => e[0] === code);
    if (currEle === undefined) data.push([code, 1]);
    else data[data.indexOf(currEle)] = [code, currEle[1]+1];
  }