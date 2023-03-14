// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./OfferBase.sol";

contract JobBase is OfferBase {
    uint256 jobsIndex = 1;

    enum JobStatus {
        accepted,
        done,
        doneConfirmed,
        failed
    }

    struct Job {
        uint256 offerId;
        JobStatus status;
        address workerAddress;
    }

    event JobCompleted(string indexed title);

    mapping(uint256 => Job) public jobs;
}
