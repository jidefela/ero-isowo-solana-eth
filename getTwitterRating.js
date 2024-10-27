const axios = require("axios");

async function getTwitterScore(tokenTwitterHandle) {
    const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

    const config = {
        headers: {
            Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
        },
    };

    // Fetch basic account metrics
    let userData, followerCount, engagementScore;

    try {
        userData = await axios.get(`https://api.twitter.com/2/users/by/username/${tokenTwitterHandle}?user.fields=public_metrics`, config);
        followerCount = userData.data.data.public_metrics.followers_count;
    } catch (error) {
        console.error("Error fetching Twitter user data:", error);
        return;
    }

    // Calculate engagement score based on recent tweets
    let engagementSum = 0;
    try {
        const tweets = await axios.get(`https://api.twitter.com/2/users/${userData.data.data.id}/tweets?tweet.fields=public_metrics`, config);
        tweets.data.data.forEach(tweet => {
            engagementSum += tweet.public_metrics.like_count + tweet.public_metrics.retweet_count;
        });
        engagementScore = engagementSum / tweets.data.data.length;
    } catch (error) {
        console.error("Error fetching tweets:", error);
        return;
    }

    // Final Score Calculation
    const engagementToFollowerRatio = engagementScore / followerCount;
    const score = {
        followerCount,
        engagementScore,
        engagementToFollowerRatio,
    };

    console.log("Twitter Score:", score);
    return score;
}

getTwitterScore("token_handle_here");
