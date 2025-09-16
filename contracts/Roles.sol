// SPDX-License-Identifier: MIT
// certify-CHAIN
pragma solidity 0.8.30;

contract CertifyRoles {
    address public admin;
    mapping(address => bool) public directors;
    mapping(address => bool) public students;
    address[] public allDirectors;
    address[] public allStudents;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can execute this function");
        _;
    }

    // 🔹 Add director and save in list
    function addDirector(address _director) public onlyAdmin {
        require(!directors[_director], "Already a director");
        directors[_director] = true;
        allDirectors.push(_director);
    }

    // 🔹 Remove director (does not delete from list, keeps history)
    function removeDirector(address _director) public onlyAdmin {
        require(directors[_director], "Not a director");
        directors[_director] = false;
    }

    // 🔹 Add student (by admin or director) and save in list
    function addStudent(address _student) public {
        require(msg.sender == admin || directors[msg.sender], "Not authorized");
        require(!students[_student], "Already a student");
        students[_student] = true;
        allStudents.push(_student);
    }

    // 🔹 Remove student (admin only)
    function removeStudent(address _student) public onlyAdmin {
        require(students[_student], "Not a student");
        students[_student] = false;
    }

    // 🔹 Return role in text format
    function checkRole(address _address) public view returns (string memory) {
        if (_address == admin) {
            return "admin";
        } else if (directors[_address]) {
            return "director";
        } else if (students[_address]) {
            return "student";
        } else {
            return "none";
        }
    }

    // 🔹 Return full list of directors (may include inactive ones)
    function getAllDirectors() public view returns (address[] memory) {
        return allDirectors;
    }

    // 🔹 Return full list of students (may include inactive ones)
    function getAllStudents() public view returns (address[] memory) {
        return allStudents;
    }
}