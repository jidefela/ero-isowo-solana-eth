require("dotenv").config();
const axios = require("axios");
const { ethers } = require("ethers");

const QUICKNODE_URL = process.env.QUICKNODE_URL;
const provider = new ethers.providers.JsonRpcProvider(QUICKNODE_URL);

// Parameters
const SLIPPAGE = 0.02; // Adjust for allowable price deviation

// Step 1: Monitor DexScreener
async function fetchLatestTokens() {
    const url = "https://api.dexscreener.com/latest/tokens";
    const response = await axios.get(url);
    return response.data.tokens;
}

// Step 2: Execute Transaction with QuickNode
async function executeBuy(tokenAddress) {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const amountInEth = ethers.utils.parseEther("0.01");

    try {
        const tx = await wallet.sendTransaction({
            to: tokenAddress,
            value: amountInEth,
            gasLimit: ethers.utils.hexlify(100000),
        });
        console.log("Transaction sent:", tx.hash);
    } catch (error) {
        console.error("Error sending transaction:", error);
    }
}

// Step 3: Main Bot Execution
async function sniperBot() {
    const tokens = await fetchLatestTokens();
    for (let token of tokens) {
        if (isValidToken(token)) {
            console.log(`Sniping token: ${token.symbol}`);
            await executeBuy(token.address);
        }
    }
}

// Helper: Validate Tokens
function isValidToken(token) {
    // Placeholder logic for valid tokens; customize as needed
    return token.symbol && token.address;
}

// Run the bot
sniperBot();
