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

# Minting on Ropsten network (in development)

- change `/packages/react/src/App.jsx` to `ropsten` network, at line `64`:
```javascript
const initialNetwork = NETWORKS.ropsten;
```
- change to alchemy/ropsten: `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js` with your new key
- update networks `/packages/hardhat/hard.config.js` add `mnemonic` to set the deployer account from `Ropsten`.

## 1.  Deploy smart contracts to Ropsten Testnet
- Compile smart contracts:
```sh
yarn compile
```

- Deploy
```sh
yarn deploy --network ropsten
```

## 2. Mint a few sample collectibles
```sh
yarn mint --network ropsten
```
Switch to `Ropsten` and connect Metamask wallet to view minted collectibles at `http://localhost:3000/`

🔏 Edit contract in `packages/hardhat/contracts`

📝 Edit frontend `App.jsx` in `packages/react-app/src`

💼 Edit deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app

# 📚 Documentation

Documentation: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

# Config


🌍 You need an RPC key for testnets and production deployments, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js` with your new key.

📣 And a `InfuraID` for production (curent one is from scaffoldeth)

## App Config

You must create a .env file in `packages/react-app` with the following
fields defined:

```env
REACT_APP_ADMIN=YourAdmin@admin.com
REACT_APP_PASSWORD=YouAdmin's Password
REACT_APP_API=Server endpoint
```