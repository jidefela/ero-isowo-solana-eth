require("dotenv").config();
const axios = require("axios");
const { Connection, PublicKey, Keypair, Transaction, SystemProgram } = require("@solana/web3.js");

//Only snipe pump.fun tokens

// Setup connection to Solana node
const connection = new Connection(process.env.QUICKNODE_URL, "confirmed");

// Wallet setup
const wallet = Keypair.fromSecretKey(new Uint8Array(JSON.parse(process.env.PRIVATE_KEY)));
const SLIPPAGE = parseFloat(process.env.SLIPPAGE);

// Fetch latest tokens from Dexscreener
async function fetchDexTokens() {
    const response = await axios.get("https://api.dexscreener.io/latest/dex/tokens?chain=solana");
    return response.data.tokens;
}

// Calculate transaction details with slippage
async function prepareTransaction(tokenAddress, buyAmount) {
    const transaction = new Transaction();
    
    const slippageAdjustedAmount = buyAmount * (1 - SLIPPAGE);

    transaction.add(SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(tokenAddress),
        lamports: slippageAdjustedAmount,
    }));

    return transaction;
}

// Execute the transaction
async function executeTransaction(transaction) {
    try {
        const signature = await connection.sendTransaction(transaction, [wallet]);
        console.log(`Transaction successful with signature: ${signature}`);
    } catch (error) {
        console.error("Transaction failed:", error);
    }
}

// Main function to fetch and buy tokens
async function sniperBot() {
    const tokens = await fetchDexTokens();

    for (let token of tokens) {
        if (isEligibleToken(token)) {
            console.log(`Sniping token: ${token.symbol}`);
            const transaction = await prepareTransaction(token.address, 0.01 * 1e9);
            await executeTransaction(transaction);
        }
    }
}

// Define token filtering criteria
function isEligibleToken(token) {
    return token.symbol && token.address;
}

// Run bot
sniperBot();
