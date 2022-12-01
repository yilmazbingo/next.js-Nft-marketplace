const NftMarket = artifacts.require("NftMarket");

// this is responsible to deploy the nftMarket contract
module.exports = function (deployer) {
  deployer.deploy(NftMarket);
};
