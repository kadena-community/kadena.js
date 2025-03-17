import { CoinContract } from "./coin-contract";

const coinContract = new CoinContract();

coinContract.transferCreate('Alice', 'Bob', 'guard', 1);
