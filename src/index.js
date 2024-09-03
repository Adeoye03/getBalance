import { createApp } from "@deroll/app";
import { createWallet } from "@deroll/wallet";
import { getAddress, hexToString, stringToHex } from "viem";

const app = createApp({ url: process.env.ROLLUP_HTTP_SERVER_URL || "http://127.0.0.1:5004" });
const wallet = createWallet();

app.addAdvanceHandler(wallet.handler);

app.addInspectHandler(async ({ payload }) => {
    const url = hexToString(payload).split("/"); // e.g., "rollup/balance/0x1234..."
    console.log("Inspect call for balance:", url);
    
    if (url[1] === "balance") {
        const address = getAddress(url[2]);
        const eth_balance = wallet.etherBalanceOf(address);
        await app.createReport({ payload: stringToHex(String(eth_balance)) });
    } else {
        console.log("Invalid inspect call");
        await app.createReport({ payload: stringToHex("Invalid inspect call") });
    }
});

app.start().catch((e) => {
    console.error(e);
    process.exit(1);
});
