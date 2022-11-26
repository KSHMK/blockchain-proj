// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AudioItemToken is ERC721Enumerable, AccessControl {
    bytes32 public constant VIEW_SECERET_ROLE = keccak256("VIEW_SECERET_ROLE");
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public mintPrice = 0.0001 ether;
    address payable public owner;

    mapping(uint => string) private tokenHashs;
    mapping(uint => string) private tokenKeys;
    mapping(uint => string) private tokenURIs;

    constructor() payable ERC721("AudioItem", "ADI") {
        owner = payable(msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setPrice(uint256 price) public onlyRole(DEFAULT_ADMIN_ROLE) {
        mintPrice = price;
    }

    function withdraw() public onlyRole(DEFAULT_ADMIN_ROLE) {
        uint amount = address(this).balance;

        (bool success, ) = owner.call{value: amount}("");
        require(success, "Failed to send Ether");
    }

    function tokenHash(uint _tokenId) public view returns (string memory) {
        require(_exists(_tokenId));
        return tokenHashs[_tokenId];
    }

    function tokenURI(uint _tokenId) override public view returns (string memory) {
        require(_exists(_tokenId));
        require(hasRole(VIEW_SECERET_ROLE, msg.sender) || ownerOf(_tokenId) == msg.sender, "No privilage");
        return tokenURIs[_tokenId];
    }
    
    function tokenKEY(uint _tokenId) public view returns (string memory) {
        require(_exists(_tokenId));
        require(hasRole(VIEW_SECERET_ROLE, msg.sender) || ownerOf(_tokenId) == msg.sender, "No privilage");
        return tokenKeys[_tokenId];
    }

    struct tokendata {
        uint tokenId;
        string hash;
        string key;
        string uri;
    }

    function tokenList() public view returns (tokendata[] memory) {
        uint len = balanceOf(msg.sender);
        tokendata[] memory result = new tokendata[](len);
        
        for (uint i = 0; i < len; i++) {
            result[i].tokenId = tokenOfOwnerByIndex(msg.sender, i);
            result[i].hash = tokenHash(result[i].tokenId);
            result[i].key = tokenKEY(result[i].tokenId);
            result[i].uri = tokenURI(result[i].tokenId);
        }
        return result;
    }

    function addAudio(string memory hash, string memory key, string memory URI) public payable returns (uint256)
    {
        require(msg.value >= mintPrice);
        if(msg.value > mintPrice)
        {
            uint _amount = msg.value - mintPrice;
            (bool success, ) = payable(msg.sender).call{value: _amount}("");
            require(success, "Failed to send Ether");
        }
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        tokenURIs[newTokenId] = URI;
        tokenKeys[newTokenId] = key;
        tokenHashs[newTokenId] = hash;

        _tokenIds.increment();
        return newTokenId;
    }

}
