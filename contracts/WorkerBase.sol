// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./JobBase.sol";

contract WorkerBase is JobBase {
    enum RegistrationStatus {
        none,
        registrationPending,
        approved,
        denied
    }

    enum SkillLevel {
        beginner,
        intermediate,
        expert
    }

    struct WorkerRegistration {
        string name;
        string email;
        string image;
        RegistrationStatus status;
    }

    struct Worker {
        string name;
        string email;
        string image;
        uint256 tasksCompleted;
        uint256 tasksAccepted;
        uint256[] acceptedJobs;
        SkillLevel skillLevel;
        bool badActor;
    }

    mapping(address => WorkerRegistration) public registrations;
    mapping(address => Worker) public workers;
    //mapping(uint256 => address) public jobWorker;

    event WorkerApproved(address indexed worker, string indexed name);
    event WorkerRejected(address indexed worker, string indexed reason);
    event NewRegistration(string indexed name, string indexed email);

    modifier onlyValidWorkers() {
        require(workers[msg.sender].badActor == false, "worker must have integrity");
        _;
    }

    modifier onlyJobWorker(uint256 _jobId) {
        require(jobs[_jobId].workerAddress == msg.sender, "Sender is not job worker");
        _;
    }
    
    modifier onlyValidRegistration(string calldata _name, string calldata _email) {
        require(registrations[msg.sender].status == RegistrationStatus.none, "Registration already submitted");
        require(bytes(_name).length != 0, "Name must not be empty");
        require(bytes(_email).length != 0, "Email must not be empty");
        _;
    }

    function register(string calldata _name, string calldata _email, string calldata _image) onlyValidRegistration(_name, _email) external {
        registrations[msg.sender] = WorkerRegistration(_name, _email, _image, RegistrationStatus.registrationPending);

        emit NewRegistration(_name, _email);
    }

    function acceptOffer(uint256 _offerId) external onlyValidWorkers() onlyAvailableOffers(_offerId) {
        offers[_offerId].inExecution = true;
        //when offer is accepted, new job is created
        jobs[jobsIndex++] = Job(_offerId, JobStatus.accepted, msg.sender);
        workers[msg.sender].tasksAccepted++;

        emit OfferAccepted(msg.sender, offers[_offerId].title);
    }

    function jobCompleted(uint256 _jobId) external onlyJobWorker(_jobId) {
        jobs[_jobId].status = JobStatus.done;

        emit JobCompleted(offers[jobs[_jobId].offerId].title);
    }

    function jobFailed(uint256 _jobId) external onlyJobWorker(_jobId) {
        jobs[_jobId].status = JobStatus.failed;
        offers[jobs[_jobId].offerId].inExecution = false;
    }

    function confirmJobCompleted(uint256 _jobId) external{
        require(msg.sender == offers[jobs[_jobId].offerId].client, "Only client can confirm job done");
        (bool success, ) = jobs[_jobId].workerAddress.call{value: offers[jobs[_jobId].offerId].budget}("");
        require(success);
    }

    function getJobs() external view returns(Job[] memory ) {
        Job[] memory jobsArray = new Job[](jobsIndex - 1);
        for(uint256 i = 0; i < jobsIndex - 1; i++) {
            jobsArray[i] = jobs[i+1];
        }

        return jobsArray;
    }   
}