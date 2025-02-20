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
            values[problemDifficultyTag[tagIndex++]] = tempProblems;
        }
    }

    return values;
};


module.exports = {
    extractJsonString,
    extractProblemStats,
}