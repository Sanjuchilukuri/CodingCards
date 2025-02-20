const axios = require('axios');
const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');
const { extractJsonString, extractProblemStats } = require('./helper');

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
        </ul>
    `);
});

app.get('/api/gfg-stats', async (req,res) => {
    let userName = req.query.userName;
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

        // Extract problem difficulty stats
        const problemStats = extractProblemStats(response(problemNavbar[0]).text());
        Object.assign(values, problemStats);

        values["ProgressBar"] = values.pod_solved_global_longest_streak
                ? (100 * Math.PI * values.pod_solved_longest_streak) / values.pod_solved_global_longest_streak
                : 0;
        return res.send(values);
    }
    res.send("UserName required!!");
});

app.get('/api/leetcode-stats', async(req,res) => {
    let userName = req.query.userName;

    if(userName)
    {   
        const response = await axios.get("https://leetcode.com/graphql/", {
            data:{
                operationName: "userProfileUserQuestionProgressV2",
                query: "\n    query userProfileUserQuestionProgressV2($userSlug: String!) {\n  userProfileUserQuestionProgressV2(userSlug: $userSlug) {\n    numAcceptedQuestions {\n      count\n      difficulty\n    }\n    numFailedQuestions {\n      count\n      difficulty\n    }\n    numUntouchedQuestions {\n      count\n      difficulty\n    }\n    userSessionBeatsPercentage {\n      difficulty\n      percentage\n    }\n    totalQuestionBeatsPercentage\n  }\n}\n    ",
                variables: {userSlug: "sanju1819"}
            }
        });
        return res.send(response.data);
    }
    res.send("UserName required!!");
});

app.get('/api/codechef-stats', async(req,res) => {
    let userName = req.query.userName;
    if( userName )
    { 
        let response = (await axios.get("https://www.codechef.com/users/sanju1819")).data;
        res.send(response);
    }
    res.send("UserName required!!");
});

app.listen(5000, console.log("started "))
