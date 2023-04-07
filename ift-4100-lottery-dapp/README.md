This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Requirements

1. Ganache
2. MetaMask (on your web browser)
3. Node.js

## Getting Started

1. Install the node_modules:

```bash
npm install
```

2. Set the owner variable in Lottery.sol to a public key of your choice.

3. Migrate and deploy the smart contract:

```bash
cd backend
# and
truffle migrate
# and
truffle build Lottery.sol
# and
truffle deploy Lottery.sol
```

4. Copy the given contract address of the deployement and paste it in the LotteryAddress constant (.utils/constants.js)

5. Run the development server:

```bash
cd ift-4100-lottery-dapp
# and
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.