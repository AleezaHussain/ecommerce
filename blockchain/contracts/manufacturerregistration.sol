// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ManufacturerNFTStorage is ERC721URIStorage {
    // Status enum with Pending, Approved, Rejected
    enum Status { Pending, Approved, Rejected }

    struct Manufacturer {
        address wallet;
        string jsonCID;
        string pdfCID;
        Status status;  // Status now directly using the Status enum
    }

    mapping(uint256 => Manufacturer) public manufacturerData;
    mapping(address => uint256) public walletToTokenId;
    uint256 private _tokenIdCounter;

    event ManufacturerStored(uint256 indexed tokenId, address indexed wallet, string jsonCID, string pdfCID, Status status);
    event ManufacturerStatusUpdated(uint256 indexed tokenId, Status newStatus);

    constructor() ERC721("ManufacturerNFT", "MNFT") {}

    function storeManufacturer(address _manufacturer, string memory _jsonCID, string memory _pdfCID) external {
        require(_manufacturer != address(0), "Invalid manufacturer address");
        require(bytes(_jsonCID).length > 0, "JSON CID cannot be empty");
        require(bytes(_pdfCID).length > 0, "PDF CID cannot be empty");
        require(walletToTokenId[_manufacturer] == 0, "Manufacturer already stored");

        uint256 tokenId = ++_tokenIdCounter;

        _mint(_manufacturer, tokenId);
        _setTokenURI(tokenId, _jsonCID); // ✅ Store the JSON CID as token URI

        manufacturerData[tokenId] = Manufacturer(_manufacturer, _jsonCID, _pdfCID, Status.Pending); // Default status is Pending
        walletToTokenId[_manufacturer] = tokenId;

        emit ManufacturerStored(tokenId, _manufacturer, _jsonCID, _pdfCID, Status.Pending); // Emit Pending status
    }

    function updateManufacturerStatus(uint256 _tokenId, Status _newStatus) external {
        require(ownerOf(_tokenId) != address(0), "Token does not exist");

        // Ensure the new status is either Approved or Rejected
        require(_newStatus == Status.Approved || _newStatus == Status.Rejected, "Invalid Status");

        manufacturerData[_tokenId].status = _newStatus;

        // Emit the updated status
        emit ManufacturerStatusUpdated(_tokenId, _newStatus);
    }

    function getManufacturerDetails(address _manufacturer) external view returns (
        uint256 tokenId,
        string memory jsonCID,
        string memory pdfCID,
        Status status
    ) {
        require(walletToTokenId[_manufacturer] != 0, "Manufacturer not found");
        tokenId = walletToTokenId[_manufacturer];
        Manufacturer memory manufacturer = manufacturerData[tokenId];
        return (tokenId, manufacturer.jsonCID, manufacturer.pdfCID, manufacturer.status);
    }

    function getPendingManufacturers() external view returns (uint256[] memory, string[] memory, string[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            if (manufacturerData[i].status == Status.Pending) { // Use Status.Pending instead of 0
                count++;
            }
        }

        uint256[] memory tokenIds = new uint256[](count);
        string[] memory jsonCIDs = new string[](count);
        string[] memory pdfCIDs = new string[](count);

        uint256 index = 0;
        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            if (manufacturerData[i].status == Status.Pending) { // Use Status.Pending instead of 0
                tokenIds[index] = i;
                jsonCIDs[index] = manufacturerData[i].jsonCID;
                pdfCIDs[index] = manufacturerData[i].pdfCID;
                index++;
            }
        }

        return (tokenIds, jsonCIDs, pdfCIDs);
    }

    function getApprovedManufacturers() external view returns (uint256[] memory, string[] memory, string[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            if (manufacturerData[i].status == Status.Approved) { // Use Status.Approved instead of 1
                count++;
            }
        }

        uint256[] memory approvedTokenIds = new uint256[](count);
        string[] memory approvedJSONCIDs = new string[](count);
        string[] memory approvedPDFCIDs = new string[](count);

        uint256 index = 0;
        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            if (manufacturerData[i].status == Status.Approved) { // Use Status.Approved instead of 1
                approvedTokenIds[index] = i;
                approvedJSONCIDs[index] = manufacturerData[i].jsonCID;
                approvedPDFCIDs[index] = manufacturerData[i].pdfCID;
                index++;
            }
        }
        return (approvedTokenIds, approvedJSONCIDs, approvedPDFCIDs);
    }

    function getRejectedManufacturers() external view returns (uint256[] memory, string[] memory, string[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            if (manufacturerData[i].status == Status.Rejected) { // Use Status.Rejected instead of 2
                count++;
            }
        }

        uint256[] memory rejectedTokenIds = new uint256[](count);
        string[] memory rejectedJSONCIDs = new string[](count);
        string[] memory rejectedPDFCIDs = new string[](count);

        uint256 index = 0;
        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            if (manufacturerData[i].status == Status.Rejected) { // Use Status.Rejected instead of 2
                rejectedTokenIds[index] = i;
                rejectedJSONCIDs[index] = manufacturerData[i].jsonCID;
                rejectedPDFCIDs[index] = manufacturerData[i].pdfCID;
                index++;
            }
        }
        return (rejectedTokenIds, rejectedJSONCIDs, rejectedPDFCIDs);
    }

    function getManufacturerStatus(address _manufacturer) external view returns (Status) {
        require(walletToTokenId[_manufacturer] != 0, "Manufacturer not found");
        uint256 tokenId = walletToTokenId[_manufacturer];
        return manufacturerData[tokenId].status;
    }

    function login(address _manufacturer) external view returns (bool) {
        require(walletToTokenId[_manufacturer] != 0, "Manufacturer not found");
        uint256 tokenId = walletToTokenId[_manufacturer];
        return manufacturerData[tokenId].status == Status.Approved; // Use Status.Approved instead of 1
    }

    function getIndividualManufacturer(address _manufacturer) external view returns (
        string memory jsonCID,
        string memory pdfCID,
        Status status
    ) {
        require(walletToTokenId[_manufacturer] != 0, "Manufacturer not found");
        uint256 tokenId = walletToTokenId[_manufacturer];
        Manufacturer memory manufacturer = manufacturerData[tokenId];
        return (manufacturer.jsonCID, manufacturer.pdfCID, manufacturer.status);
    }
}
