import { expect } from "chai";
import { ethers } from "hardhat";
import { CertifyRoles } from "../typechain-types";

describe("CertifyRoles", function () {
  let certifyRoles: CertifyRoles;
  let admin: any;
  let director1: any;
  let student1: any;
  let other: any;

  beforeEach(async function () {
    [admin, director1, student1, other] = await ethers.getSigners();
    
    const CertifyRolesFactory = await ethers.getContractFactory("CertifyRoles");
    certifyRoles = await CertifyRolesFactory.deploy();
    await certifyRoles.waitForDeployment();
  });

  describe("Admin functions", function () {
    it("Should set the admin correctly", async function () {
      expect(await certifyRoles.admin()).to.equal(admin.address);
    });

    it("Should allow admin to add a director", async function () {
      await certifyRoles.addDirector(director1.address);
      expect(await certifyRoles.directors(director1.address)).to.be.true;
      expect(await certifyRoles.checkRole(director1.address)).to.equal("director");
    });

    it("Should allow admin to remove a director", async function () {
      await certifyRoles.addDirector(director1.address);
      await certifyRoles.removeDirector(director1.address);
      expect(await certifyRoles.directors(director1.address)).to.be.false;
      expect(await certifyRoles.checkRole(director1.address)).to.equal("none");
    });

    it("Should allow admin to add a student", async function () {
      await certifyRoles.addStudent(student1.address);
      expect(await certifyRoles.students(student1.address)).to.be.true;
      expect(await certifyRoles.checkRole(student1.address)).to.equal("student");
    });

    it("Should allow admin to remove a student", async function () {
      await certifyRoles.addStudent(student1.address);
      await certifyRoles.removeStudent(student1.address);
      expect(await certifyRoles.students(student1.address)).to.be.false;
      expect(await certifyRoles.checkRole(student1.address)).to.equal("none");
    });
  });

  describe("Director functions", function () {
    beforeEach(async function () {
      await certifyRoles.addDirector(director1.address);
    });

    it("Should allow director to add a student", async function () {
      await certifyRoles.connect(director1).addStudent(student1.address);
      expect(await certifyRoles.students(student1.address)).to.be.true;
      expect(await certifyRoles.checkRole(student1.address)).to.equal("student");
    });

    it("Should not allow director to add another director", async function () {
      await expect(
        certifyRoles.connect(director1).addDirector(other.address)
      ).to.be.revertedWith("Only the admin can execute this function");
    });

    it("Should not allow director to remove a student", async function () {
      await certifyRoles.addStudent(student1.address);
      await expect(
        certifyRoles.connect(director1).removeStudent(student1.address)
      ).to.be.revertedWith("Only the admin can execute this function");
    });
  });

  describe("Role checking", function () {
    beforeEach(async function () {
      await certifyRoles.addDirector(director1.address);
      await certifyRoles.addStudent(student1.address);
    });

    it("Should return correct roles", async function () {
      expect(await certifyRoles.checkRole(admin.address)).to.equal("admin");
      expect(await certifyRoles.checkRole(director1.address)).to.equal("director");
      expect(await certifyRoles.checkRole(student1.address)).to.equal("student");
      expect(await certifyRoles.checkRole(other.address)).to.equal("none");
    });
  });

  describe("List functions", function () {
    it("Should return list of directors", async function () {
      await certifyRoles.addDirector(director1.address);
      const directors = await certifyRoles.getAllDirectors();
      expect(directors).to.include(director1.address);
      expect(directors.length).to.equal(1);
    });

    it("Should return list of students", async function () {
      await certifyRoles.addStudent(student1.address);
      const students = await certifyRoles.getAllStudents();
      expect(students).to.include(student1.address);
      expect(students.length).to.equal(1);
    });
  });

  describe("Access control", function () {
    it("Should prevent non-admin/non-director from adding students", async function () {
      await expect(
        certifyRoles.connect(other).addStudent(student1.address)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should prevent adding same director twice", async function () {
      await certifyRoles.addDirector(director1.address);
      await expect(
        certifyRoles.addDirector(director1.address)
      ).to.be.revertedWith("Already a director");
    });

    it("Should prevent adding same student twice", async function () {
      await certifyRoles.addStudent(student1.address);
      await expect(
        certifyRoles.addStudent(student1.address)
      ).to.be.revertedWith("Already a student");
    });
  });
});