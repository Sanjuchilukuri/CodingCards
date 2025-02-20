export const Urls = {
    GeekForGeeks : "https://www.geeksforgeeks.org/user/sanju_chilukuri",
    LeetCode : "https://leetcode.com/u/sanju1819",
    CodeChef : "https://www.codechef.com/users/sanju1819",
    CodeForces : "https://codeforces.com/profile/Sanju19420",
    HackerRank : "https://www.hackerrank.com/profile/sanju1819",
}

export const apiUrls = {
    GeekForGeeks : "https://www.geeksforgeeks.org/gfg-assets/_next/data/pdjI7pIK3Y46qDCFuGJcp/user/",
    LeetCode : "https://leetcode.com/graphql/",
    CodeChef : "",
    CodeForces:"",
    HackerRank:""
}

export const LeetCodeBody = {
  "query": "\n    query userProfileUserQuestionProgressV2($userSlug: String!) {\n  userProfileUserQuestionProgressV2(userSlug: $userSlug) {\n    numAcceptedQuestions {\n      count\n      difficulty\n    }\n    numFailedQuestions {\n      count\n      difficulty\n    }\n    numUntouchedQuestions {\n      count\n      difficulty\n    }\n    userSessionBeatsPercentage {\n      difficulty\n      percentage\n    }\n    totalQuestionBeatsPercentage\n  }\n}\n    ",
  "variables": {
    "userSlug": "sanju1819"
  },
  "operationName": "userProfileUserQuestionProgressV2"
}

export const Platforms = {
    GeekForGeeks : "geekforgeeks",
    LeetCode : "LeetCode",
    CodeChef : "CodeChef",
    CodeForces : "CodeForces",
    HackerRank : "HackerRank"
}