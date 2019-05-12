class Breeder{
    constructor(){
        this.pet_a = null;
        this.pet_b = null;

    }
    handle(pet){
        console.log(pet);
        this.pet_a = this.pet_b;
        this.pet_b = pet;
        if (this.pet_a !=null && this.pet_a != this.pet_b){
            if (confirm('Breed '+ this.pet_a+ 'and '+this.pet_b+'?')) App.handleBreed(this.pet_a,this.pet_b);
            else{
                this.reset();
            };
        }
    }
    reset(){
        this.pet_a = null;
        this.pet_b = null;
    }
}
App = {
    web3Provider: null,
    contracts: {},
    breeder: new Breeder(),
    init: function() {
        var adoptionInstance;

        return App.contracts.Adoption.deployed().then(function(instance) {
            adoptionInstance = instance;
            console.log(instance);
            return adoptionInstance.getPets.call().then(function(data){
                console.log(data);
                //$.getJSON('../pets.json', function (data) {
                var petsRow = $('#petsRow');
                var petTemplate = $('#petTemplate');

                for (var i = 0; i < data[0].length; i++) {
                    petTemplate.find('.panel-title').text(data[0][i]);//.name);
                    petTemplate.find('img').attr('src', data[1][i]);//.picture);
                    petTemplate.find('.pet-breed').text(data[3][i]);//.breed);
                    petTemplate.find('.pet-age').text(1);
                    petTemplate.find('.pet-location').text(data[2]);//.location);
                    petTemplate.find('.btn-adopt').attr('data-id',i);

                    petsRow.append(petTemplate.html());
                }

            }).catch(function(e){
                console.log(e);
            }); //});
        //});
            //return App.markAdopted();
        });
        //return App.markAdopted();
        //return await App.initWeb3();

    },

    initWeb3: async function() {
        // Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);
        return App.initContract();
    },

    initContract: function() {
        $.getJSON('Adoption.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var AdoptionArtifact = data;
            App.contracts.Adoption = TruffleContract(AdoptionArtifact);

            // Set the provider for our contract
            App.contracts.Adoption.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the adopted pets
            return App.init() ;
            //return App.markAdopted();
        });
        return App.bindEvents();
        //return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', '.btn-adopt', App.handleAdopt);
    },

    markAdopted: function(adopters, account) {
        var adoptionInstance;

        App.contracts.Adoption.deployed().then(function(instance) {
            adoptionInstance = instance;

            return adoptionInstance.getAdopters.call();
        }).then(function(adopters) {
            for (i = 0; i < adopters.length; i++) {
                if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
                    $('.panel-pet').eq(i).find('button').text('Breed').attr('onclick', "test("+i+')');
                }
            }
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    handleAdopt: function(event) {
        event.preventDefault();

        var petId = parseInt($(event.target).data('id'));

        var adoptionInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.Adoption.deployed().then(function(instance) {
                adoptionInstance = instance;

                // Execute adopt as a transaction by sending account
                return adoptionInstance.adopt(petId, {from: account});
            }).then(function(result) {
                return App.markAdopted();
            }).catch(function(err) {
                console.log(err.message);
            });
        });
    },
    handleBreed: function(pet_a,pet_b){
        event.preventDefault();
        var adoptionInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.Adoption.deployed().then(function(instance) {
                adoptionInstance = instance;

                // Execute adopt as a transaction by sending account
                return adoptionInstance.breed(pet_a,pet_b, {from: account});
            }).then(function(result) {
                console.log("success");
                adoptionInstance.petNumber.call().then(function(result){
                    App.init();
                })


            }).catch(function(err) {
                console.log(err.message);
            });
        });

    }

};

$(function() {
    $(window).load(function() {
        App.initWeb3();
    });
});
function test(i){
    App.breeder.handle(i);

}