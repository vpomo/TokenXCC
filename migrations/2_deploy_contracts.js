const XCCCrowdsale = artifacts.require('./XCCCrowdsale.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner = "0xB91626C64019E432591b2b4C4f654f2949DC841d";

    deployer.deploy(XCCCrowdsale, owner);

};
