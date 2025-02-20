import * as cheerio from "cheerio";
import Api from "../Api/Api";

export const getGFGStats = async () => {
    var response = (await Api.get("https://api.allorigins.win/get?url=https://www.geeksforgeeks.org/user/sanju_chilukuri/")).data.contents;    
    return cheerio.load(response!);
}

export const getLeetCodeStats = async () => {
    // const response = await Api.get("https://api.allorigins.win/get?url=https://leetcode.com/graphql/", {
    // const response = await Api.get("https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql/", {
    const response = await Api.get("https://leetcode.com/graphql/", {
        data:{
            operationName: "userProfileUserQuestionProgressV2",
            query: "\n    query userProfileUserQuestionProgressV2($userSlug: String!) {\n  userProfileUserQuestionProgressV2(userSlug: $userSlug) {\n    numAcceptedQuestions {\n      count\n      difficulty\n    }\n    numFailedQuestions {\n      count\n      difficulty\n    }\n    numUntouchedQuestions {\n      count\n      difficulty\n    }\n    userSessionBeatsPercentage {\n      difficulty\n      percentage\n    }\n    totalQuestionBeatsPercentage\n  }\n}\n    ",
            variables: {userSlug: "sanju1819"}
        }
    });
    return response.data;
};  