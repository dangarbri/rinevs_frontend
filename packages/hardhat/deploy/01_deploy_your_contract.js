const {ethers} = require("hardhat")

const localChainId = "31337"


module.exports = async({getNamedAccounts, deployments, getChainId}) => {
  const {deploy} = deployments;
  const {deployer } = await getNamedAccounts()
  const chainId = await getChainId()

  await deploy("YourCollectible", {
    from: deployer,
    log: true,
    waitConfirmations:5,
  })
}

module.exports.tags = ["YourCollectible"]
