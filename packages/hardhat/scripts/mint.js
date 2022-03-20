/* eslint no-use-before-define: "warn" */
const fs = require("fs")
const chalk = require("chalk")
const { config, ethers } = require("hardhat")
const { utils } = require("ethers")
const R = require("ramda")
const { create } = require('ipfs-http-client')
const ipfs = create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })


const delayMS = 1000

const main = async () => {
  // address to mint NFTs to, default address from local node
  const toAddress = '0x1Df4D4FA3d513De5d6a4E95a5DCcC8CBB02569B3' 
  const localProvider = new ethers.providers.StaticJsonRpcProvider("http://localhost:8545")
  let block = await localProvider.getBlockNumber()

  localProvider.resetEventsBlock(1)

  const { deployer } = await getNamedAccounts()
  const YourCollectible = await ethers.getContract("YourCollectible", deployer)

  // image assets
  const images = [
    './scripts/privateassets/buffalo.jpg',
    './scripts/privateassets/fish.jpg',
    './scripts/privateassets/zebra.jpg',
    './scripts/privateassets/rhino.jpg',
    './scripts/privateassets/fish.jpg',
    './scripts/privateassets/flamingo.jpg',
    './scripts/privateassets/godzilla.jpg',
  ]

  const buffaloImage = fs.readFileSync(images[0])

  const uploadedBuffaloImage = await ipfs.add(buffaloImage)

  console.log("Buffalo image uploaded to:", uploadedBuffaloImage.path)

  const buffalo = {
    "description": "This is a buffalo",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": uploadedBuffaloImage.path,
    "name": "Fish",
    "attributes": [
      {
        "trait_type": "BackgroundColor",
        "value": "green"
      },
      {
        "trait_type": "Eyes",
        "value": "googly"
      },
      {
        "trait_type": "Stamina",
        "value": 42
      }
    ]
  }

  console.log("Uploading manifest...")
  const uploadBuffaloManifest = await ipfs.add(JSON.stringify(buffalo))

  console.log("image tokenUri is ", uploadedBuffaloImage.path)

  
 

  console.log("MINTING buffalo!!!")
  await YourCollectible.mintItem(toAddress, uploadedBuffaloImage.path)

  await sleep(delayMS)

  const zebraImage = fs.readFileSync(images[1])
  const uploadedZebraImage = await ipfs.add(zebraImage)

  const zebra = {
    "description": "What is it so worried about?",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": uploadedZebraImage.path,
    "name": "Zebra",
    "attributes": [
      {
        "trait_type": "BackgroundColor",
        "value": "blue"
      },
      {
        "trait_type": "Eyes",
        "value": "googly"
      },
      {
        "trait_type": "Stamina",
        "value": 38
      }
    ]
  }

  console.log("Uploading zebra...")
  const uploadedzebraManifest = await ipfs.add(JSON.stringify(zebra))

  console.log("Minting zebra with IPFS hash (" + uploadedZebraImage.path + ")")
  await YourCollectible.mintItem(toAddress, uploadedZebraImage.path, { gasLimit: 400000 })
  

  await sleep(delayMS)


  const rhinoImage = fs.readFileSync(images[2])
  const uploadedRhinoImage = await ipfs.add(rhinoImage)

  const rhino = {
    "description": "What a horn!",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": uploadedRhinoImage.path,
    "name": "Rhino",
    "attributes": [
      {
        "trait_type": "BackgroundColor",
        "value": "pink"
      },
      {
        "trait_type": "Eyes",
        "value": "googly"
      },
      {
        "trait_type": "Stamina",
        "value": 22
      }
    ]
  }
  console.log("Uploading rhino...")
  const uploadedrhino = await ipfs.add(JSON.stringify(rhino))

  console.log("Minting rhino with IPFS hash (" + uploadedrhino.path + ")")
  await YourCollectible.mintItem(toAddress, uploadedrhino.path, { gasLimit: 400000 })

  
  await sleep(delayMS)

  const fishImage = fs.readFileSync(images[3])
  const uploadedFishImage = await ipfs.add(fishImage)

  const fish = {
    "description": "Is that an underbyte?",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": uploadedFishImage.path,
    "name": "Fish",
    "attributes": [
      {
        "trait_type": "BackgroundColor",
        "value": "blue"
      },
      {
        "trait_type": "Eyes",
        "value": "googly"
      },
      {
        "trait_type": "Stamina",
        "value": 15
      }
    ]
  }
  console.log("Uploading fish...")
  const uploadedfish = await ipfs.add(JSON.stringify(fish))

  console.log("Minting fish with IPFS hash (" + uploadedfish.path + ")")
  await YourCollectible.mintItem(toAddress, uploadedfish.path, { gasLimit: 400000 })

  
 
  await sleep(delayMS)


  const flamingoImage = fs.readFileSync(images[4])
  const uploadedFlamingoImage = await ipfs.add(flamingoImage)

  const flamingo = {
    "description": "So delicate.",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": uploadedFlamingoImage.path,
    "name": "Flamingo",
    "attributes": [
      {
        "trait_type": "BackgroundColor",
        "value": "black"
      },
      {
        "trait_type": "Eyes",
        "value": "googly"
      },
      {
        "trait_type": "Stamina",
        "value": 6
      }
    ]
  }
  console.log("Uploading flamingo...")
  const uploadedflamingo = await ipfs.add(JSON.stringify(flamingo))

  console.log("Minting flamingo with IPFS hash (" + uploadedflamingo.path + ")")
  await YourCollectible.mintItem(toAddress, uploadedflamingo.path, { gasLimit: 400000 })


  await sleep(delayMS)

  const godzillaImage = fs.readFileSync(images[5])
  const uploadedgodZillaImage = await ipfs.add(godzillaImage)

  const godzilla = {
    "description": "Raaaar!",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": uploadedgodZillaImage.path,
    "name": "Godzilla",
    "attributes": [
      {
        "trait_type": "BackgroundColor",
        "value": "orange"
      },
      {
        "trait_type": "Eyes",
        "value": "googly"
      },
      {
        "trait_type": "Stamina",
        "value": 99
      }
    ]
  }
  console.log("Uploading godzilla...")
  const uploadedgodzilla = await ipfs.add(JSON.stringify(godzilla))

  console.log("Minting godzilla with IPFS hash (" + uploadedgodzilla.path + ")")
  await YourCollectible.mintItem(toAddress, uploadedgodzilla.path, { gasLimit: 400000 })

  await sleep(delayMS)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

