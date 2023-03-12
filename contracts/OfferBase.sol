// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract OfferBase {
    uint256 offersIndex = 1;

    enum OfferCategory {
        marketing,
        sales,
        development,
        accounting
    }

    struct Offer {
        string title;
        string description;
        uint256 budget;
        OfferCategory category;
        uint256 expirationTime;
        address client;
        bool valid;
        bool inExecution;
        uint256 jobId;
    }

    event NewOffer(string indexed title, OfferCategory indexed category);
    event OfferAccepted(address indexed executor, string indexed title);

    mapping(uint256 => Offer) public offers;
    
    modifier onlyAvailableOffers(uint256 _offerId) {
        Offer memory offer = offers[_offerId];     
        require(offer.valid == true, "Offer is no longer valid");
        require(offer.client != msg.sender, "Cannot accept your own offers");
        require(offer.inExecution == false, "Cannot accept offers in execution");
        _;
    }

    modifier onlyCancelable(uint256 _offerId) {
        Offer memory offer = offers[_offerId];     
        require(offer.client == msg.sender, "Only task owner can cancel offer");   
        require(offer.inExecution == false, "Cannot cancel offer in execution");
        _;
    }

    function publishOffer(
        string memory _title,
        string memory _description,
        uint256 _budget,
        OfferCategory _category,
        uint256 _expirationTime
    ) external payable {
        require(msg.value  >= _budget, "Must deposit budget to contact");
        offers[offersIndex++] = Offer(_title, _description, _budget, _category, _expirationTime, msg.sender, true, false, 0);

        emit NewOffer(_title, _category);
    }

    function cancelOffer (uint256 _offerId) external onlyCancelable(_offerId){
        offers[_offerId].valid = false;
    }
    
}