// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./WorkerBase.sol";

contract Dlancer is WorkerBase {
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller must be an owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function approveWorker(
        address _workerAddress,
        SkillLevel _skill
    ) external onlyOwner {
        registrations[_workerAddress].status = RegistrationStatus.approved;
        workers[_workerAddress] = Worker(
            registrations[_workerAddress].name,
            registrations[_workerAddress].email,
            registrations[_workerAddress].image,
            0,
            0,
            new uint256[](0),
            _skill,
            false
        );

        emit WorkerApproved(_workerAddress, registrations[_workerAddress].name);
    }

    function rejectWorker(
        address _workerAddress,
        string memory _reason
    ) public onlyOwner {
        registrations[_workerAddress].status = RegistrationStatus.denied;

        emit WorkerRejected(_workerAddress, _reason);
    }

    function banWorker(address _workerAddress) external onlyOwner {
        rejectWorker(_workerAddress, "Reported as dishonest dude");
        workers[_workerAddress].badActor = true;
    }
}
