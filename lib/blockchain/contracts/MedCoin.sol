// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MedCoin is ERC20, Ownable {
    mapping(address => bool) public authorizedDoctors;
    mapping(address => uint256) public consultationFees;

    event PaymentProcessed(address patient, address doctor, uint256 amount);
    event DoctorAuthorized(address doctor);
    event FeeUpdated(address doctor, uint256 newFee);

    constructor() ERC20("MedCoin", "MEDC") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function authorizeDoctorAddress(address doctor) external onlyOwner {
        authorizedDoctors[doctor] = true;
        emit DoctorAuthorized(doctor);
    }

    function setConsultationFee(uint256 fee) external {
        require(authorizedDoctors[msg.sender], "Not an authorized doctor");
        consultationFees[msg.sender] = fee;
        emit FeeUpdated(msg.sender, fee);
    }

    function payDoctor(address doctor) external {
        require(authorizedDoctors[doctor], "Not an authorized doctor");
        uint256 fee = consultationFees[doctor];
        require(fee > 0, "Consultation fee not set");
        require(balanceOf(msg.sender) >= fee, "Insufficient MedCoin balance");

        _transfer(msg.sender, doctor, fee);
        emit PaymentProcessed(msg.sender, doctor, fee);
    }
}