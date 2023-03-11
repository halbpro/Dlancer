// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Dlancer {  
    uint256 offersIndex = 1;

    enum OfferCategory {
        marketing,
        sales,
        development,
        accounting
    }

    enum JobStatus {
        accepted,
        finished,
        failed
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
    }
    struct Job {
        uint256 id;
        uint256 offerId;
        JobStatus status;
    }

    //client
    //mapping(address => Offer[]) public offers;
    mapping(uint256 => Offer) public offers;
    mapping(address => Job) public jobs;

    event NewOffer(string indexed title, OfferCategory indexed category);
    event OfferAccepted(address indexed executor, string indexed title);

    constructor () {

    }

    //*******vec klasov, nardimo worker contract, more bit approvan

    function publishOffer(
        string memory _title,
        string memory _description,
        uint256 _budget,
        OfferCategory _category,
        uint256 _expirationTime
    ) external payable {
        require(msg.value  >= _budget, "Must pay in advance");
        offers[offersIndex++] = Offer(_title, _description, _budget, _category, _expirationTime, msg.sender, true, false);
        emit NewOffer(_title, _category);
    }

    function cancelOffer (uint256 _offerIf) external {
        Offer memory offer = offers[_offerIf];     
        require(offer.client == msg.sender, "Only task owner can cancel offer");   
        require(offer.inExecution == false, "Cannot cancel offer in execution");
        offers[_offerIf].valid = false;
    }

    function acceptOffer(uint256 _offerIf) external {
        Offer memory offer = offers[_offerIf];     
        require(offer.valid == true, "Offer is no longer valid");
        require(offer.client != msg.sender, "Cannot accept your own offers");
        //check expiration date and merge in one modifier
        offers[_offerIf].inExecution = true;
        emit OfferAccepted(msg.sender, offer.title);
    }
}
