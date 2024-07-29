# Solana Balance Transfer Script

This script demonstrates how to transfer SOL tokens between two wallets on the Solana blockchain using the `@solana/web3.js` library.

## Prerequisites

- Node.js installed on your machine.
- NPM (Node Package Manager) installed.

## Setup

1. Clone the repository or download the script file.

2. Navigate to the project directory and install the required dependencies:

    ```sh
    npm install @solana/web3.js
    ```

## Usage

1. Ensure you are in the project directory.

2. Run the script:

    ```sh
    node transfer_balance.js
    ```

## Script Explanation

The script performs the following steps:

1. **Imports Required Modules**: Imports necessary modules from the `@solana/web3.js` library.

    ```javascript
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
    ```

2. **Establishes a Connection**: Connects to the Solana Devnet.

    ```javascript
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    ```

3. **Generates Keypairs**: Creates new keypairs for the sender and recipient wallets.

    ```javascript
    const from = Keypair.generate();
    const to = Keypair.generate();
    ```

4. **Airdrops SOL**: Requests an airdrop of 1 SOL to the sender wallet and confirms the transaction.

    ```javascript
    const airdropSignature = await connection.requestAirdrop(from.publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignature);
    ```

5. **Fetches Balance**: Retrieves and logs the balance of the sender wallet.

    ```javascript
    let fromBalance = await connection.getBalance(from.publicKey);
    console.log(`Sender wallet balance: ${fromBalance / LAMPORTS_PER_SOL} SOL`);
    ```

6. **Calculates Transfer Amount**: Calculates 50% of the sender's balance to be transferred.

    ```javascript
    let transferAmount = fromBalance / 2;
    ```

7. **Creates and Sends Transaction**: Creates a transaction to transfer 50% of the balance to the recipient wallet, signs it, and sends it.

    ```javascript
    let transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: transferAmount
        })
    );

    let signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log("Transfer transaction signature:", signature);
    ```

8. **Logs New Balance**: Fetches and logs the new balance of the sender wallet.

    ```javascript
    fromBalance = await connection.getBalance(from.publicKey);
    console.log(`New sender wallet balance: ${fromBalance / LAMPORTS_PER_SOL} SOL`);
    ```

## Error Handling

The script includes error handling for the transaction process. If the transaction fails, it logs the error and any available transaction logs.

```javascript
catch (error) {
    console.error("Transaction failed:", error);
    if (error.logs) {
        console.error("Transaction logs:", error.logs);
    }
}

```
## License
This project is licensed under the MIT License.

