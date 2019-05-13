pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Adoption {

    address[] public adopters;
    string[] public names;
    string[] public urls;
    string[] public locations;
    string[] public breeds;

    struct Parents {
        uint parent1;
        uint parent2;
    }

    Parents[] public childToParents;

    uint[] adoptionTime;
    uint public petNumber;

    constructor(string[] memory name ,string[] memory url ,string[] memory location,string[] memory breed) public {
        require(url.length == name.length);
        require(url.length == location.length);
        require(location.length == breed.length);
        petNumber = name.length;
        for (uint i=0;i<petNumber;i++){
            adopters.push(address(0));
            adoptionTime.push(0);
            childToParents.push(Parents(0,0));
            urls.push(url[i]);
            names.push(name[i]);
            locations.push(location[i]);
            breeds.push(breed[i]);
        }
    }

    // Adopting a pet
    function adopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= (petNumber - 1));

        adopters[petId] = msg.sender;
        adoptionTime[petId] = now;

        return petId;
    }

    // Breeding a pet
    function breed(uint petId_1, uint petId_2) public returns (uint) {
        require(petId_1 >= 0 && petId_1 <= petNumber-1);
        require(petId_2 >= 0 && petId_2 <= petNumber-1);
        require(adopters[petId_1] == adopters[petId_2]);
        require(adoptionTime[petId_1] >= 1 hours);
        require(adoptionTime[petId_2] >= 1 hours);

        petNumber = petNumber + 1;
        adopters.push(msg.sender);
        childToParents.push( Parents(petId_1, petId_2));

        return petNumber-1;
    }

    // Retrieving the adopters
    function getAdopters() public view returns (address[] memory) {
        return adopters;
    }

    function getPets()  public view returns (string[] memory,string[] memory,string[] memory,string[] memory){
        return (names,urls,locations,breeds);

    }
    function getNames()  public view returns (string[] memory){
        return names;
    }



        // Retrieving the adopters
    function getParents(uint petId) public view returns (uint[2] memory) {
        require(petId >= 0 && petId <= (petNumber - 1));
        uint[2] memory res;
        res[0] = childToParents[petId].parent1;
        res[1] = childToParents[petId].parent2;
        return res;
    }

}
