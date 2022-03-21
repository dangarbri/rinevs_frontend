# Svenir dApp

# 🏄‍♂️ Quick Start

Prerequisites: [Node (v16 LTS)](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)





> install and start your 👷‍ Hardhat chain:

```bash
cd <root_directory>
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd <root_directory>
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd scaffold-eth
yarn deploy
```
> Mint a few NFTs by editting `/packages/hardhat/scripts/mint.js`:
- change `toAddress` to set the address to mint the NFTs to
- Edit the images, metadata
- Run `yarn mint` to mint

🔏 Edit contract in `packages/hardhat/contracts`

📝 Edit frontend `App.jsx` in `packages/react-app/src`

💼 Edit deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app

# 📚 Documentation

Documentation: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

# Config


🌍 You need an RPC key for testnets and production deployments, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js` with your new key.

📣 And a `InfuraID` for production (curent one is from scaffoldeth)

