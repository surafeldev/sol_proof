const {
    Connection,
    PublicKey,
    Keypair,
    LAMPORTS_PER_SOL,
    SystemProgram,
    sendAndConfirmTransaction,
    clusterApiUrl,
    Transaction
} = require("@solana/web3.js");

const transferSol = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Generate a new keypair for the sender wallet
    const from = Keypair.generate();

    // Generate another Keypair for the recipient wallet
    const to = Keypair.generate();

    // Airdrop 1 SOL to the sender wallet
    console.log("Airdropping 1 SOL to the sender wallet...");
    const airdropSignature = await connection.requestAirdrop(from.publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignature);

    // Fetch the balance of the sender wallet
    let fromBalance = await connection.getBalance(from.publicKey);
    console.log(`Sender wallet balance: ${fromBalance / LAMPORTS_PER_SOL} SOL`);

    // Calculate 50% of the sender's balance
    let transferAmount = fromBalance / 2;

    // Create a transaction to transfer 50% of the balance to the recipient wallet
    let transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: transferAmount
        })
    );

    // Sign and send the transaction
    try {
        let signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );
        console.log("Transfer transaction signature:", signature);
    } catch (error) {
        console.error("Transaction failed:", error);
        if (error.logs) {
            console.error("Transaction logs:", error.logs);
        }
    }

    // Fetch the new balance of the sender wallet
    fromBalance = await connection.getBalance(from.publicKey);
    console.log(`New sender wallet balance: ${fromBalance / LAMPORTS_PER_SOL} SOL`);
};

transferSol();