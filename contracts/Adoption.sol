pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Adoption {

  address[] public adopters;

  struct Parents {
      uint parent1;
      uint parent2;
  }

  Parents[] public childToParents;

  uint[] adoptionTime;
  uint public petNumber = 16;

  // Adopting a pet
  function adopt(uint petId) public returns (uint) {
    require(petId >= 0 && petId <= (petNumber - 1));

    adopters[petId] = msg.sender;
    adoptionTime[petId] = now;

    return petId;
  }

  // Breeding a pet
  function breed(uint petId_1, uint petId_2) public returns (uint) {
    require(petId_1 >= 0 && petId_1 <= 15);
    require(petId_2 >= 0 && petId_2 <= 15);
    require(adopters[petId_1] == adopters[petId_2]);
    require(adoptionTime[petId_1] >= 1 hours);
    require(adoptionTime[petId_2] >= 1 hours);

    petNumber = petNumber + 1;
    adopters[petNumber] = msg.sender;
    childToParents[petNumber] = Parents(petId_1, petId_2);

    return petNumber;
  }

  // Retrieving the adopters
  function getAdopters() public view returns (address[] memory) {
    return adopters;
  }

  // Retrieving the adopters
  function getParents(uint petId) public view returns (Parents memory) {
    require(petId >= 0 && petId <= (petNumber - 1));
    return childToParents[petId];
  }

}
