const XCCCrowdsale = artifacts.require('./XCCCrowdsale.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner = "0x03C5477957ce72Bae0A0283f1bCF63d8cadd7ef0";

    deployer.deploy(XCCCrowdsale, owner);

};
