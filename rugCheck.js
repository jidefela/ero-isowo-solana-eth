//Look at contracts and holders using @Rugcheckxyz

const level = "warn" | ""


const axios = require("axios");

// Solana example (use another for ERC-20 tokens or others)
async function checkTopHolders(tokenAddress, threshold = 0.1) {
    try {

        let config = {
            headers: {
                token: process.env.SOLSCAN_API_KEY,
            }
        }

        const tokenInfo = await axios.get(` https://api.rugcheck.xyz/v1/tokens/${tokenAddress}/report/summary`);

        // Calculate percentage of total supply held by top holders
        const topHolderPercentage = topHoldersSupply / tokenInfo.supply * 100;

        return topHolderPercentage < threshold * 100; // If true, it's safely below threshold
    } catch (error) {
        console.error("Error checking top holders:", error);
        return false;
    }
}

// Usage
checkTopHolders("your_token_address_here").then(isSafe => {
    console.log(`Top holders own ${isSafe ? "an acceptable" : "a high"} percentage of the supply.`);
});
