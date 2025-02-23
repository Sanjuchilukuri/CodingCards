const axios = require('axios');
const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const { extractJsonString, extractProblemStats, generateGFGSvg, generateLeetcodeSvg } = require('./helper');

puppeteer.use(StealthPlugin());
const app = express();
app.use(cors());


app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the CodingCards Backend!</h1>
        <p>Available Endpoints:</p>
        <ul>
            <li><code>/api/gfg-stats?userName="your_user_Name"</code> - Get GFG stats</li>
            <li><code>/api/leetcode-stats?userName="your_user_Name"</code> - Get Leetcode stats</li>
            <li><code>/api/codechef-stats?userName="your_user_Name"</code> - Get Codechef stats</li>
            <li><code>/api/codeforces-stats?userName="your_user_Name"</code> - Get Codeforces stats</li>
        </ul>
    `);
});

app.get('/api/gfg-stats', async (req,res) => {
    let userName = req.query?.userName;
    let action = req.query?.action || 'rawData';
    let theme = req.query?.theme || 'dark';
    if( userName )
    {
        let response = (await axios.get(`https://www.geeksforgeeks.org/user/${userName}/`));
        response = cheerio.load(response?.data);
        const problemNavbar = response('.problemNavbar_head__cKSRi');   
        
        const rawJsonString = response('div').next().text().trim();
        const jsonData = extractJsonString(rawJsonString);

        const pageProps = jsonData.props?.pageProps || {};
        const userInfo = pageProps.userInfo || {};

        // Gather user stats
        const values = {
            userHandle: pageProps.userHandle,
            pod_solved_longest_streak: userInfo.pod_solved_longest_streak || 0,
            pod_solved_global_longest_streak: userInfo.pod_solved_global_longest_streak || 0,
            total_problems_solved: userInfo.total_problems_solved || 0,
            total_score: userInfo.score || 0,
            monthly_score: userInfo.monthly_score || 0,
            current_rating: pageProps.contestData?.current_rating || 0
        };

        const problemStats = extractProblemStats(response(problemNavbar[0]).text());
        Object.assign(values, problemStats);

        values["ProgressBar"] = values.pod_solved_global_longest_streak
                ? (100 * Math.PI * values.pod_solved_longest_streak) / values.pod_solved_global_longest_streak
                : 0;
        
        response = (await axios.get("https://practiceapi.geeksforgeeks.org/api/vr/problems/?pageMode=explore&page=1&difficulty=-1")).data;
        values["basicProblemsTotal"] = response["total"];
        values["basicProblemsProgress"] = (values["Basic"]/response["total"])*100;

        response = (await axios.get("https://practiceapi.geeksforgeeks.org/api/vr/problems/?pageMode=explore&page=1&difficulty=0")).data;
        values["easyProblemsTotal"] = response["total"];
        values["easyProblemsProgress"] = (values["Easy"]/response["total"])*100;

        response = (await axios.get("https://practiceapi.geeksforgeeks.org/api/vr/problems/?pageMode=explore&page=1&difficulty=1")).data;
        values["mediumProblemsTotal"] = response["total"];
        values["mediumProblemsProgress"] = (values["Medium"]/response["total"])*100;

        response = (await axios.get("https://practiceapi.geeksforgeeks.org/api/vr/problems/?pageMode=explore&page=1&difficulty=2")).data;
        values["hardProblemsTotal"] = response["total"];
        values["hardProblemsProgress"] = (values["Hard"]/response["total"])*100;

        
        if( action == "profileCard" )
        {
            let svg = await generateGFGSvg(values,theme);
            res.setHeader("Content-Type", "image/svg+xml");
            res.send(svg);
        }
        else if( action == "rawData" )
        {
            res.send(values);
        }
    }
    else
    {
        res.send("UserName required!!");
    }
});

app.get('/api/leetcode-stats', async(req,res) => {
    let userName = req.query.userName;
    let action = req.query?.action;
    let theme = req.query?.theme || 'dark';

    if(userName)
    {   
        let response = (await axios.get("https://leetcode.com/graphql/", {
            data:{
                operationName: "userProfileUserQuestionProgressV2",
                query: "\n    query userProfileUserQuestionProgressV2($userSlug: String!) {\n  userProfileUserQuestionProgressV2(userSlug: $userSlug) {\n    numAcceptedQuestions {\n      count\n      difficulty\n    }\n    numFailedQuestions {\n      count\n      difficulty\n    }\n    numUntouchedQuestions {\n      count\n      difficulty\n    }\n    userSessionBeatsPercentage {\n      difficulty\n      percentage\n    }\n    totalQuestionBeatsPercentage\n  }\n}\n    ",
                variables: {userSlug: userName}
            }
        })).data;

        const progress = response.data.userProfileUserQuestionProgressV2;

        let totalSolvedProblems = 0;
        let totalProblems = 0;
        let totalEasySolvedProblems = 0, totalMediumSolvedProblems = 0, totalHardSolvedProblems = 0;
        let totalEasyProblems = 0, totalMediumProblems = 0, totalHardProblems = 0;

        const difficulties = ["EASY", "MEDIUM", "HARD"];

        difficulties.forEach(difficulty => {
            let solved = progress.numAcceptedQuestions.find(q => q.difficulty === difficulty)?.count || 0;
            let failed = progress.numFailedQuestions.find(q => q.difficulty === difficulty)?.count || 0;
            let untouched = progress.numUntouchedQuestions.find(q => q.difficulty === difficulty)?.count || 0;
            
            let total = solved + failed + untouched;
            
            totalSolvedProblems += solved;
            totalProblems += total;

            if (difficulty === "EASY") {
                totalEasySolvedProblems = solved;
                totalEasyProblems = total;
            } else if (difficulty === "MEDIUM") {
                totalMediumSolvedProblems = solved;
                totalMediumProblems = total;
            } else if (difficulty === "HARD") {
                totalHardSolvedProblems = solved;
                totalHardProblems = total;
            }
        });

        response = (await axios.get("https://leetcode.com/graphql/", {
            data:{
                    operationName: "userContestRankingInfo",
                    query: "query userContestRankingInfo($username: String!) { userContestRanking(username: $username) { attendedContestsCount rating globalRanking totalParticipants topPercentage } }",
                    variables: {
                        "username": userName
                    }
                }}
        )).data;

        const values = {
            totalProblems,
            totalSolvedProblems,
            totalEasyProblems,
            totalEasySolvedProblems,
            totalMediumProblems,
            totalMediumSolvedProblems,
            totalHardProblems,
            totalHardSolvedProblems,
            userName
        }

        values["ProgressBar"] = values.totalSolvedProblems
        ? (100 * Math.PI * values.totalSolvedProblems) / values.totalProblems
        : 0;

        const contestRanking = response.data.userContestRanking;
        values["attendedContestsCount"] = contestRanking.attendedContestsCount;
        values["contestRating"] = Math.floor(contestRanking.rating);

        response = (await axios.get("https://leetcode.com/graphql/",{
            data:{
                operationName: "userBadges",
                query : "query userBadges($username: String!) {matchedUser(username: $username) {badges {id\n      name\n      shortName\n      displayName\n      }}}",
                variables : {username: userName}
            }
        })).data;

        values["badgesCount"] = response.data.matchedUser.badges.length;

        if( action == "profileCard" )
        {
            let svg = await generateLeetcodeSvg(values, theme);
            res.setHeader("Content-Type", "image/svg+xml");
            res.send(svg);
        }
        else if( action == "rawData" )
        {
            return res.send(values);
        }
    }
    else
    {
        res.send("UserName required!!");
    }
});

app.get('/api/codechef-stats', async(req,res) => {
    let userName = req.query.userName;
    if( userName )
    { 
        let response = (await axios.get("https://www.codechef.com/users/sanju1819")).data;
        let $ = cheerio.load(response);

        let profileImageUrl = $('.profileImage').attr("src");
        
        let rating = $(".user-details .rating").text().trim();
        
        let ratingContainer = $("aside .widget-rating .rating-header");
        let currentrating = ratingContainer.find(".rating-number").text().trim();
        let higestRatingText = ratingContainer.find("small").text().trim().split(" ");
        let higestRating = higestRatingText[higestRatingText.length - 1].substring(0, higestRatingText[higestRatingText.length - 1].length-1);
        
        let participatedContests = $(".rating-graphs .rating-title-container b").text().trim();
        
        let totalSolvedProblemsText =  $(".rating-data-section").find("h3").last().text().trim().split(" ");
        let totalSolvedProblems = totalSolvedProblemsText[totalSolvedProblemsText.length - 1];

        let values = {
            userName,
            profileImageUrl,
            stars: rating,
            currentrating,
            higestRating,
            participatedContests,
            totalSolvedProblems
        }
        return res.send(values);
    }
    else{
        res.send("UserName required!!");
    }
});

app.get('/api/codeforces-stats', async(req,res) => {
    let userName = req.query?.userName;
    
    if(userName)
    {
        const browser = await puppeteer.launch({headless:"new"});
        const page = await browser.newPage();
        
        await page.goto(`https://codeforces.com/profile/${userName}`, { 
            waitUntil:"domcontentloaded"
        });

        let pageContent = await page.content();
        let $ = cheerio.load(pageContent);

        let profileImageUrl = $('.title-photo img').attr("src");
        let rank = $('.info .main-info .user-rank').text().trim();
        let contextRatingContainer = $(".info ul");

        let currentContextRating = contextRatingContainer.find("li").first().find("span").first().text();
        
        let highestContextRating = contextRatingContainer.find("li").first().find("span span").last().text();
        
        let totalSolvedProblems = $("._UserActivityFrame_counterValue").text().split(" ")[0];

        await page.goto(`https://codeforces.com/contests/with/${userName}?type=all`,{
            waitUntil:"domcontentloaded"
        });

        pageContent = await page.content();
        $ = cheerio.load(pageContent);

        let totalParticipatedContests = $(".user-contests-table tbody tr td").first().text();

        await browser.close();

        res.send({
            profileImageUrl,
            rank,
            currentContextRating,
            highestContextRating,
            totalSolvedProblems,
            totalParticipatedContests
        });
    }
    else
    {
        res.send("userName required!");
    }
});

app.listen(5000, console.log("started "))
