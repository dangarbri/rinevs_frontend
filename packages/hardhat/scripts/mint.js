/* eslint no-use-before-define: "warn" */
const fs = require("fs/promises")
const chalk = require("chalk")
const { config, ethers } = require("hardhat")
const { utils } = require("ethers")
const R = require("ramda")
const { create } = require('ipfs-http-client')
const ipfs = create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })


const delayMS = 1000

const main = async () => {
  const { deployer } = await getNamedAccounts()
  const toAddress = deployer // mint all the collectibles to the depoying account, should be automatically displayed when account is connected to Metamask and appropriate network
  console.log('deployer', deployer)
  const YourCollectible = await ethers.getContract("YourCollectible", deployer)

  // image assets
  const images = [
    './scripts/privateassets/buffalo.jpeg',
    './scripts/privateassets/fish.jpg',
    './scripts/privateassets/rhino.jpg',
    './scripts/privateassets/zebra.jpeg',
    './scripts/privateassets/flamingo.jpg',
    './scripts/privateassets/godzilla.jpeg',
  ]

  const buffaloImage = await fs.readFile(images[0])

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
  await YourCollectible.mintItem(toAddress, uploadBuffaloManifest.path)

  await sleep(delayMS)

  const fishImage = await fs.readFile(images[1])
  const uploadedFishImage = await ipfs.add(fishImage)
  console.log(uploadedFishImage.path)
  const fish = {
    "description": "What is it so worried about?",
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
        "value": 38
      }
    ]
  }

  console.log("Uploading fish...")
  const uploadedFishManifest = await ipfs.add(JSON.stringify(fish))

  console.log("Minting Fish with IPFS hash (" + uploadedFishImage.path + ")")
  await YourCollectible.mintItem(toAddress, uploadedFishManifest.path, { gasLimit: 400000 })
  

  await sleep(delayMS)


  const rhinoImage = await fs.readFile(images[2])
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
  const uploadedrhinoManifest = await ipfs.add(JSON.stringify(rhino))

  console.log("Minting rhino with IPFS hash (" + uploadedRhinoImage.path + ")")
  await YourCollectible.mintItem(toAddress, uploadedrhinoManifest.path, { gasLimit: 400000 })

  
  await sleep(delayMS)

  const zebraImage = await fs.readFile(images[3])
  const uploadedZebraImage = await ipfs.add(zebraImage)

  const zebra = {
    "description": "Is that an underbyte?",
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
        "value": 15
      }
    ]
  }
  console.log("Uploading zebra...")
  const uploadedZebraManifest = await ipfs.add(JSON.stringify(zebra))

  console.log("Minting fish with IPFS hash (" + uploadedZebraImage.path + ")")
  await YourCollectible.mintItem(toAddress, uploadedZebraManifest.path, { gasLimit: 400000 })

  await sleep(delayMS)


  const flamingoImage = await fs.readFile(images[4])
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
  const uploadedflamingoManifest = await ipfs.add(JSON.stringify(flamingo))

  console.log("Minting flamingo with IPFS hash (" + uploadedFlamingoImage.path + ")")
  await YourCollectible.mintItem(toAddress, uploadedflamingoManifest.path, { gasLimit: 400000 })


  await sleep(delayMS)

  const godzillaImage = await fs.readFile(images[5])
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
  const uploadedgodzillaManifest = await ipfs.add(JSON.stringify(godzilla))

  console.log("Minting godzilla with IPFS hash (" + uploadedgodZillaImage.path + ")")
  await YourCollectible.mintItem(toAddress, uploadedgodzillaManifest.path, { gasLimit: 400000 })

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
  