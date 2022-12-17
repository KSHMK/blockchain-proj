// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AudioItemToken is AccessControl {
    bytes32 public constant VIEW_SECERET_ROLE = keccak256("VIEW_SECERET_ROLE");
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public mintPrice = 0.001 ether;
    address payable public contractOwner;

    uint private totalToken;
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;

    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;
    
    mapping(uint => string) private tokenHashs;
    mapping(uint => string) private tokenKeys;
    mapping(uint => string) private tokenURIs;

    constructor() payable {
        contractOwner = payable(msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setPrice(uint256 price) public onlyRole(DEFAULT_ADMIN_ROLE) {
        mintPrice = price;
    }

    function withdraw() public onlyRole(DEFAULT_ADMIN_ROLE) {
        uint amount = address(this).balance;

        (bool success, ) = contractOwner.call{value: amount}("");
        require(success, "Failed to send Ether");
    }

    function balanceOf(address owner) public view virtual returns (uint256) {
        require(owner != address(0), "Address zero is not a valid owner");
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "Invalid token ID");
        return owner;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _owners[tokenId] != address(0);
    }

    function tokenHash(uint _tokenId) public view returns (string memory) {
        require(_exists(_tokenId), "Invalid token ID");
        return tokenHashs[_tokenId];
    }

    function tokenURI(uint _tokenId) public view returns (string memory) {
        require(_exists(_tokenId), "Invalid token ID");
        require(hasRole(VIEW_SECERET_ROLE, msg.sender) || ownerOf(_tokenId) == msg.sender, "No privilage");
        return tokenURIs[_tokenId];
    }
    
    function tokenKEY(uint _tokenId) public view returns (string memory) {
        require(_exists(_tokenId), "Invalid token ID");
        require(hasRole(VIEW_SECERET_ROLE, msg.sender) || ownerOf(_tokenId) == msg.sender, "No privilage");
        return tokenKeys[_tokenId];
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256) {
        require(index < balanceOf(owner), "Owner index out of bounds");
        return _ownedTokens[owner][index];
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
        require(msg.value >= mintPrice, "Sender value is lower than mint price");
        if(msg.value > mintPrice)
        {
            uint _amount = msg.value - mintPrice;
            (bool success, ) = payable(msg.sender).call{value: _amount}("");
            require(success, "Failed to send Ether");
        }
        address sender = msg.sender;
        uint256 newTokenId = _tokenIds.current();
        
        _ownedTokens[sender][_balances[sender]] = newTokenId;
        _owners[totalToken] = sender;
        
        tokenURIs[newTokenId] = URI;
        tokenKeys[newTokenId] = key;
        tokenHashs[newTokenId] = hash;

        _balances[sender] += 1;
        totalToken += 1;

        _tokenIds.increment();
        return newTokenId;
    }

}
