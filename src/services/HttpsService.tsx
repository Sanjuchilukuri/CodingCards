import * as cheerio from "cheerio";
import Api from "../Api/Api";

export const getGFGStats = async () => {
    var response = (await Api.get("https://api.allorigins.win/get?url=https://www.geeksforgeeks.org/user/sanju_chilukuri/")).data.contents;    
    return cheerio.load(response!);
}