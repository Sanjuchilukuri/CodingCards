const path = require('path');
const fs = require('fs');

const extractJsonString = (rawString) => {
    try {
        let jsonString = '';
        let depth = 0;

        for (let char of rawString) {
            if (char === '{') depth++;
            if (depth > 0) jsonString += char;
            if (char === '}') depth--;
            if (depth === 0 && jsonString) break;
        }

        return JSON.parse(jsonString.trim());
    } catch (error) {
        console.error('Error parsing JSON:', error.message);
        return null;
    }
};

const extractProblemStats = (rawData) => {
    const problemDifficultyTag = ["School", "Basic", "Easy", "Medium", "Hard"];
    const values = {};
    let tagIndex = 0;

    for (let i = 0; i < rawData.length; i++) {
        if (rawData[i] === '(') {
            const tempStart = i + 1;
            while (rawData[i] !== ')') i++;
            const tempProblems = parseInt(rawData.substring(tempStart, i)) || 0;
            values[problemDifficultyTag[tagIndex++]] = tempProblems || 0;
        }
    }

    return values;
};

const loadCSS = (cssFilePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(cssFilePath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const generateLeetcodeSvg = async (data, theme='dark') => {
    
    const darkLeetcodeIcon = `<svg width="95" height="111" viewBox="0 0 95 111" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-full w-auto max-w-none"><path d="M68.0063 83.0664C70.5 80.5764 74.5366 80.5829 77.0223 83.0809C79.508 85.579 79.5015 89.6226 77.0078 92.1127L65.9346 103.17C55.7187 113.371 39.06 113.519 28.6718 103.513C28.6117 103.456 23.9861 98.9201 8.72653 83.957C-1.42528 74.0029 -2.43665 58.0749 7.11648 47.8464L24.9282 28.7745C34.4095 18.6219 51.887 17.5122 62.7275 26.2789L78.9048 39.362C81.6444 41.5776 82.0723 45.5985 79.8606 48.3429C77.6488 51.0873 73.635 51.5159 70.8954 49.3003L54.7182 36.2173C49.0488 31.6325 39.1314 32.2622 34.2394 37.5006L16.4274 56.5727C11.7767 61.5522 12.2861 69.574 17.6456 74.8292C28.851 85.8169 37.4869 94.2846 37.4969 94.2942C42.8977 99.496 51.6304 99.4184 56.9331 94.1234L68.0063 83.0664Z" fill="#FFA116"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M41.1067 72.0014C37.5858 72.0014 34.7314 69.1421 34.7314 65.615C34.7314 62.0879 37.5858 59.2286 41.1067 59.2286H88.1245C91.6454 59.2286 94.4997 62.0879 94.4997 65.615C94.4997 69.1421 91.6454 72.0014 88.1245 72.0014H41.1067Z" fill="#B3B3B3"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M49.9118 2.02335C52.3173 -0.55232 56.3517 -0.686894 58.9228 1.72277C61.494 4.13244 61.6284 8.17385 59.2229 10.7495L16.4276 56.5729C11.7768 61.552 12.2861 69.5738 17.6453 74.8292L37.4088 94.2091C39.9249 96.6764 39.968 100.72 37.505 103.24C35.042 105.761 31.0056 105.804 28.4895 103.337L8.72593 83.9567C-1.42529 74.0021 -2.43665 58.0741 7.1169 47.8463L49.9118 2.02335Z" fill="white"></path></svg>`;
    const lightLeetcodeIcon =  `<svg width="95" height="111" viewBox="0 0 95 111" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-full w-auto max-w-none"><path d="M68.0063 83.0664C70.5 80.5764 74.5366 80.5829 77.0223 83.0809C79.508 85.579 79.5015 89.6226 77.0078 92.1127L65.9346 103.17C55.7187 113.371 39.06 113.519 28.6718 103.513C28.6117 103.456 23.9861 98.9201 8.72653 83.957C-1.42528 74.0029 -2.43665 58.0749 7.11648 47.8464L24.9282 28.7745C34.4095 18.6219 51.887 17.5122 62.7275 26.2789L78.9048 39.362C81.6444 41.5776 82.0723 45.5985 79.8606 48.3429C77.6488 51.0873 73.635 51.5159 70.8954 49.3003L54.7182 36.2173C49.0488 31.6325 39.1314 32.2622 34.2394 37.5006L16.4274 56.5727C11.7767 61.5522 12.2861 69.574 17.6456 74.8292C28.851 85.8169 37.4869 94.2846 37.4969 94.2942C42.8977 99.496 51.6304 99.4184 56.9331 94.1234L68.0063 83.0664Z" fill="#FFA116"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M41.1067 72.0014C37.5858 72.0014 34.7314 69.1421 34.7314 65.615C34.7314 62.0879 37.5858 59.2286 41.1067 59.2286H88.1245C91.6454 59.2286 94.4997 62.0879 94.4997 65.615C94.4997 69.1421 91.6454 72.0014 88.1245 72.0014H41.1067Z" fill="#B3B3B3"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M49.9118 2.02335C52.3173 -0.55232 56.3517 -0.686894 58.9228 1.72277C61.494 4.13244 61.6284 8.17385 59.2229 10.7495L16.4276 56.5729C11.7768 61.552 12.2861 69.5738 17.6453 74.8292L37.4088 94.2091C39.9249 96.6764 39.968 100.72 37.505 103.24C35.042 105.761 31.0056 105.804 28.4895 103.337L8.72593 83.9567C-1.42529 74.0021 -2.43665 58.0741 7.1169 47.8463L49.9118 2.02335Z" fill="black"></path></svg>`;

    const icon = theme == 'dark' ? darkLeetcodeIcon : lightLeetcodeIcon;
    const cssFilePath = path.join(__dirname, `./public/css/${theme === 'light' ? 'light.css' : 'dark.css'}`);
    const themeCSS = await loadCSS(cssFilePath);

    const svgFilePath = path.join(__dirname, './public/css/svg.css');
    const svgCSS = await loadCSS(svgFilePath);

    return (`
    <svg width="500" height="250" viewBox="0 0 500 250" version="1.1" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" id="root" >
        
        <style id="default-colors">
            ${themeCSS}
            :root{
                --progress-dasharray: ${data.ProgressBar}
            }
        </style>
        <rect id="background" />
        <g id="icon">
            <g id="_1a">
                ${icon}
            </g>
        </g>
        
        <a href="https://leetcode.com/u/${data.userName}/" target="_blank" id="username">
            <text id="username-text">${data.userName}</text>    
        </a>

        <a href="https://www.codingcards.sanjuchilukuri.me/" target="_blank">
            <g transform="translate(350, 37)">
                <text font-size="24" font-weight="bold" fill="#1090cb">
                    Coding <tspan id="username-text">Cards</tspan>
                </text>
            </g>
        </a>


        <g id="total-streak-leetcode">
            <circle id="total-streak-bg-leetcode" />
            <circle id="total-streak-ring-leetcode" />
            <text id="total-streak-text">
                ${data.totalSolvedProblems || 0}
            </text>
        </g>

        <g id="solved-leetcode">
            <g id="easy-solved"><text id="easy-solved-type">Easy</text>
                <text id="easy-solved-count">${data.totalEasySolvedProblems || 0} / ${data.totalEasyProblems}</text>
            </g>
            <g id="medium-solved"><text id="medium-solved-type">Medium</text>
                <text id="medium-solved-count">${data.totalMediumProblems || 0} / ${data.totalMediumSolvedProblems}</text>
            </g>
            <g id="hard-solved"><text id="hard-solved-type">Hard
                </text><text id="hard-solved-count">${data.totalHardProblems || 0} / ${data.totalHardSolvedProblems}</text>
            </g>
        </g>
        <g id="total-activity-leetcode">
            <line x1="10" y1="0" x2="490" y2="0" id="_1b" />
            <line x1="0" y1="0" x2="0" y2="64" id="_1c" />
            <line x1="0" y1="0" x2="0" y2="64" id="_1d" />
            <g id="overall-score">
                <text id="total-solved-title">Attended Contests</text>
                <text id="total-solved-count">${data.attendedContestsCount || '_ _'}</text>
            </g>
            <g id="total-solved">
                <text id="overall-score-title">Contest Rating</text>
                <text id="overall-score-count">${data.contestRating || '_ _'}</text>
            </g>
            <g id="month-score">
                <text id="month-score-title">Badges Count</text>
                <text id="month-score-count">${data.badgesCount || '_ _'}</text>
            </g>
        </g>
        <style id="_lx">
            ${svgCSS}
        </style>
    </svg>
`)
}

const generateGFGSvg = async (data, theme = 'dark') => {
    // Load the dynamic CSS
    const cssFilePath = path.join(__dirname, `./public/css/${theme === 'light' ? 'light.css' : 'dark.css'}`);
    const themeCSS = await loadCSS(cssFilePath);

    const svgFilePath = path.join(__dirname, './public/css/svg.css');
    const svgCSS = await loadCSS(svgFilePath);

    return (`
    <svg width="500" height="275" viewBox="0 0 500 275" version="1.1" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" id="root" >
        
        <style id="default-colors">
            ${themeCSS}
            :root{
                --progress-dasharray: ${data.ProgressBar}
            }
        </style>
        <rect id="background" />
        <g id="icon">
            <g id="_1a">
                <svg fill="#26a269" width="128px" height="128px" viewBox="-0.48 -0.48 24.96 24.96" role="img"
                    xmlns="http://www.w3.org/2000/svg" stroke="#26a269" stroke-width="0.00024000000000000003">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path
                            d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z">
                        </path>
                    </g>
                </svg>
            </g>
        </g>
        
        <a href="https://www.geeksforgeeks.org/user/${data.userHandle}/" target="_blank" id="username">
            <text id="username-text">${data.userHandle}</text>    
        </a>

        <a href="https://www.codingcards.sanjuchilukuri.me/" target="_blank">
            <g transform="translate(350, 37)">
                <text font-size="24" font-weight="bold" fill="#1090cb">
                    Coding <tspan id="username-text">Cards</tspan>
                </text>
            </g>
        </a>



        <g id="total-streak">
            <circle id="total-streak-bg" />
            <circle id="total-streak-ring" />
            <text id="total-streak-text">
                ${data.pod_solved_longest_streak || 0}/${data.pod_solved_global_longest_streak}
            </text>
            <text id="streak-text">STREAK</text>
            <text id="days-text">days</text>
        </g>

        <g id="solved">
            <g id="basic-solved">
                <text id="basic-solved-type">Basic</text>
                <text id="basic-solved-count">${data.Basic || 0} / ${data.basicProblemsTotal}</text>
            </g>
            <g id="easy-solved"><text id="easy-solved-type">Easy</text>
                <text id="easy-solved-count">${data.Easy || 0} / ${data.easyProblemsTotal}</text>
            </g>
            <g id="medium-solved"><text id="medium-solved-type">Medium</text>
                <text id="medium-solved-count">${data.Medium || 0} / ${data.mediumProblemsTotal}</text>
            </g>
            <g id="hard-solved"><text id="hard-solved-type">Hard
                </text><text id="hard-solved-count">${data.Hard || 0} / ${data.hardProblemsTotal}</text>
            </g>
        </g>
        <g id="total-activity">
            <line x1="10" y1="0" x2="490" y2="0" id="_1b" />
            <line x1="0" y1="0" x2="0" y2="64" id="_1c" />
            <line x1="0" y1="0" x2="0" y2="64" id="_1d" />
            <g id="overall-score">
                <text id="overall-score-title">Coding Score</text>
                <text id="overall-score-count">${data.total_score || '_ _'}</text>
            </g>
            <g id="total-solved">
                <text id="total-solved-title">Problem Solved</text>
                <text id="total-solved-count">${data.total_problems_solved || '_ _'}</text>
            </g>
            <g id="month-score">
                <text id="month-score-title">${data.current_rating ? "Contest Rating" : "Monthly Coding Score"}</text>
                <text id="month-score-count">${data.current_rating ? data.current_rating : (data.monthly_score || '_ _')}
                </text>
            </g>
        </g>
        <style id="_lx">
            ${svgCSS}
        </style>
    </svg>
`)
}

module.exports = {
    extractJsonString,
    extractProblemStats,
    generateGFGSvg,
    generateLeetcodeSvg
}