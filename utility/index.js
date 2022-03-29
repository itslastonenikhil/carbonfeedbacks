const axios = require("axios");

const getDate = () => {
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return date;
}

const getSentiment = async (description) =>{
    //get feedback sentiment
    const { score: sentiment } = (await axios.get("https://shielded-badlands-91967.herokuapp.com/analyze-sentiment", {
        params: {
            review: description,
        },
    })).data;

    return sentiment;
}



module.exports = {
    getDate,
    getSentiment
};