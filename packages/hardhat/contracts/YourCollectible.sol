pragma solidity >=0.8.0 <0.9.0;
// SPDX-License-Identifier: MIT
// task: Bump openzeppeling to v4.x.x
// compile
// mint
// list
// memoise the contract load issue, force it to load before page loads?
//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract YourCollectible is ERC721URIStorage, ERC721Enumerable, Ownable {
    address payable public _owner;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string private baseURI;

    constructor() public ERC721("YourCollectible", "YCB") {
        _setBaseURI("https://ipfs.io/ipfs/");
        _owner = payable(msg.sender);
    }

    uint256 public constant mintLimit = 1000;
    uint256 public requested;

    function mintItem(address to, string memory _tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        require(_tokenIds.current() < mintLimit, "DONE MINTING");
        _tokenIds.increment();

        uint256 id = _tokenIds.current();
        _mint(to, id);
        _setTokenURI(id, _tokenURI);

        return id;
    }

    function _setBaseURI(string memory uri) private {
        baseURI = uri;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

      event Request(address to, uint256 value);

    function requestMint()
      public
      payable
    {
      require( requested++ < mintLimit , "DONE MINTING");
      require( msg.value >= 0.001 ether, "NOT ENOUGH");
      (bool success,) = _owner.call{value:msg.value}("");
      require( success, "could not send");
      emit Request(msg.sender, msg.value);
    }
}
