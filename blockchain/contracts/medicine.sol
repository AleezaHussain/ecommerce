// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MedicineNFT is ERC721URIStorage {
    enum Status { Pending, Rejected, Accepted }

    struct Medicine {
        uint256 id;
        Status status;
        string manufacturerId;
        address wallet;
        string ipfsHash;
    }

    uint256 private _tokenIds;
    mapping(uint256 => Medicine) public medicines;
    mapping(address => uint256[]) private medicinesByWallet;
    mapping(string => uint256) private ipfsHashToTokenId;

    event MedicineMinted(uint256 indexed tokenId, address indexed owner, string manufacturerId, string ipfsHash);
    event StatusUpdated(uint256 indexed tokenId, Status newStatus);

    constructor() ERC721("MedicineNFT", "MEDNFT") {}

    function mintMedicine(string memory _manufacturerId, string memory _ipfsHash) public returns (uint256) {
    _tokenIds++;
    uint256 newTokenId = _tokenIds;

    _mint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, _ipfsHash);

    medicines[newTokenId] = Medicine({
        id: newTokenId,
        status: Status.Pending,
        manufacturerId: _manufacturerId,
        wallet: msg.sender,
        ipfsHash: _ipfsHash
    });

    ipfsHashToTokenId[_ipfsHash] = newTokenId;
    medicinesByWallet[msg.sender].push(newTokenId);

    // 🔍 Debugging
    uint256 length = medicinesByWallet[msg.sender].length;
    emit MedicineMinted(newTokenId, msg.sender, _manufacturerId, _ipfsHash);
    emit DebugMedicinesByWallet(msg.sender, newTokenId, length);

    return newTokenId;
}

    event DebugMedicinesByWallet(address indexed wallet, uint256 tokenId, uint256 length);



    // ✅ Allow anyone to update status
    function updateStatus(uint256 _tokenId, Status _newStatus) public {
        require(tokenExists(_tokenId), "Token does not exist");
        medicines[_tokenId].status = _newStatus;
        emit StatusUpdated(_tokenId, _newStatus);
    }

    function getPendingMedicines() public view returns (uint256[] memory) {
        return _filterMedicinesByStatus(Status.Pending);
    }

    function getRejectedMedicines() public view returns (uint256[] memory) {
        return _filterMedicinesByStatus(Status.Rejected);
    }

    function getApprovedMedicines() public view returns (uint256[] memory) {
        return _filterMedicinesByStatus(Status.Accepted);
    }

    function _filterMedicinesByStatus(Status _status) internal view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _tokenIds; i++) {
            if (medicines[i].status == _status) {
                count++;
            }
        }
        uint256[] memory matchingTokens = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= _tokenIds; i++) {
            if (medicines[i].status == _status) {
                matchingTokens[index] = i;
                index++;
            }
        }
        return matchingTokens;
    }

    function getAllMedicinesByManufacturer(address _wallet) public view returns (uint256[] memory, Status[] memory) {
    uint256 count = medicinesByWallet[_wallet].length;
    uint256[] memory tokenIds = new uint256[](count);
    Status[] memory statuses = new Status[](count);

    for (uint256 i = 0; i < count; i++) {
        uint256 tokenId = medicinesByWallet[_wallet][i];
        tokenIds[i] = tokenId;
        statuses[i] = medicines[tokenId].status;
    }

    return (tokenIds, statuses);
}


    function tokenExists(uint256 _tokenId) public view returns (bool) {
        try this.ownerOf(_tokenId) returns (address owner) {
            return owner != address(0);
        } catch {
            return false;
        }
    }

    function getTokenIdByIPFS(string memory hash) public view returns (uint256) {
    return ipfsHashToTokenId[hash];
}


    function verifyMedicineByQR(string memory _ipfsHash) public view returns (bool) {
        if (bytes(_ipfsHash).length == 0) {
            return false;
        }
        uint256 tokenId = ipfsHashToTokenId[_ipfsHash];
        if (tokenId == 0 || medicines[tokenId].id != tokenId) {
            return false;
        }
        return medicines[tokenId].status == Status.Accepted;
    }
}