// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
// Certify-Chain
// Authors: Jhamil, Yamil, Omar
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Pausable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CertiChainToken is ERC721, ERC721URIStorage, ERC721Pausable, Ownable {
    uint256 private _nextTokenId;
    uint256 public mintPrice = 0.001 ether; // Certificate price in native currency (ETH, SOMNIA, etc.)
    
    // Event for tracking minted certificates
    event CertificateMinted(address indexed to, uint256 indexed tokenId, string uri, uint256 price);

    constructor(address initialOwner)
        ERC721("CertiChainToken", "CTK")
        Ownable(initialOwner)
    {}

    // Pause all token transfers (only contract owner)
    function pause() public onlyOwner {
        _pause();
    }

    // Unpause all token transfers (only contract owner)
    function unpause() public onlyOwner {
        _unpause();
    }

    // Update mint price (only contract owner)
    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
    }

    // Anyone can mint by paying the required price
    function safeMint(address to, string memory uri)
        public payable returns (uint256)
    {
        require(msg.value >= mintPrice, "Insufficient payment");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit CertificateMinted(to, tokenId, uri, msg.value);
        return tokenId;
    }

    // Free mint (only for the contract owner)
    function safeMintFree(address to, string memory uri)
        public onlyOwner returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit CertificateMinted(to, tokenId, uri, 0);
        return tokenId;
    }

    // Withdraw contract funds (only owner)
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // The following functions are overrides required by Solidity
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
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
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
