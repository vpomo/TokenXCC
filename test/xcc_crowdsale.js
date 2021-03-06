var XCCCrowdsale = artifacts.require("./XCCCrowdsale.sol");
//import assertRevert from './helpers/assertRevert';

contract('XCCCrowdsale', (accounts) => {
    var contract;
    //var owner = "0x03C5477957ce72Bae0A0283f1bCF63d8cadd7ef0";
    var owner = accounts[0];

    var rate = Number(300000*1.08474);
    var buyWei = Number(1e17);
    var buyWeiNew = Number(1e17);
    var totalSupply = 5e12;

    it('should deployed contract', async ()  => {
        assert.equal(undefined, contract);
        contract = await XCCCrowdsale.deployed();
        assert.notEqual(undefined, contract);
    });

    it('get address contract', async ()  => {
        assert.notEqual(undefined, contract.address);
    });

    it('verification balance owner contract', async ()  => {
        var balanceOwner = await contract.balanceOf(owner);
        //console.log("balanceOwner = " + balanceOwner);
        assert.equal(Number(totalSupply - 1e12), balanceOwner);
    });

    it('verification of receiving Ether', async ()  => {
        var tokenAllocatedBefore = await contract.tokenAllocated.call();
        var balanceAccountTwoBefore = await contract.balanceOf(accounts[2]);
        var weiRaisedBefore = await contract.weiRaised.call();
        //console.log("tokenAllocatedBefore = " + tokenAllocatedBefore);

        var numberToken = await contract.validPurchaseTokens.call(Number(buyWei));
        //console.log(" numberTokens = " + JSON.stringify(numberToken));
        //console.log("numberTokens = " + numberToken);

        await contract.buyTokens(accounts[2],{from:accounts[2], value:buyWei});
        var tokenAllocatedAfter = await contract.tokenAllocated.call();
        //console.log("tokenAllocatedAfter = " + tokenAllocatedAfter + "; rate*buyWei = " + Number(rate*buyWei));
        assert.isTrue(tokenAllocatedBefore < tokenAllocatedAfter);
        assert.equal(0, tokenAllocatedBefore);
        assert.equal(Number(rate*buyWei/1e18).toFixed(0), tokenAllocatedAfter);

        var balanceAccountTwoAfter = await contract.balanceOf(accounts[2]);
        //console.log("balanceAccountTwoAfter = " + balanceAccountTwoAfter);
        assert.isTrue(balanceAccountTwoBefore < balanceAccountTwoAfter);
        assert.equal(0, balanceAccountTwoBefore);
        assert.equal(Number(rate*buyWei/1e18).toFixed(0), balanceAccountTwoAfter);

        var weiRaisedAfter = await contract.weiRaised.call();
        //console.log("weiRaisedAfter = " + weiRaisedAfter);
        assert.isTrue(weiRaisedBefore < weiRaisedAfter);
        assert.equal(0, weiRaisedBefore);
        assert.equal(Number(buyWei), weiRaisedAfter);

        var depositedAfter = await contract.getDeposited.call(accounts[2]);
        //console.log("DepositedAfter = " + depositedAfter);
        assert.equal(buyWei, depositedAfter);

        var balanceAccountThreeBefore = await contract.balanceOf(accounts[3]);
        await contract.buyTokens(accounts[3],{from:accounts[3], value:buyWeiNew});
        var balanceAccountThreeAfter = await contract.balanceOf(accounts[3]);
        assert.isTrue(balanceAccountThreeBefore < balanceAccountThreeAfter);
        assert.equal(0, balanceAccountThreeBefore);
        //console.log("balanceAccountThreeAfter = " + balanceAccountThreeAfter);
        //assert.equal(Number(rateNew*buyWeiNew), balanceAccountThreeAfter);

        var balanceOwnerAfter = await contract.balanceOf(owner);
        //console.log("balanceOwnerAfter = " + Number(balanceOwnerAfter));
        //assert.equal(totalSupply - balanceAccountThreeAfter - balanceAccountTwoAfter, balanceOwnerAfter);

    });

    it('verification define period', async ()  => {
        var currentDate = 1519516800; // Feb, 25
        period = await contract.getPeriod(currentDate);
        assert.equal(10, period);

        currentDate = 1529539199; // Jun, 20
        period = await contract.getPeriod(currentDate);
        assert.equal(0, period);

        currentDate = 1537398000; // Sep, 19
        period = await contract.getPeriod(currentDate);
        assert.equal(10, period);

        currentDate = 1541894399; // Nov, 10
        period = await contract.getPeriod(currentDate);
        assert.equal(1, period);

        currentDate = 1545260400; // Dec, 19
        period = await contract.getPeriod(currentDate);
        assert.equal(10, period);
    });

    it('verification claim tokens', async ()  => {

        var balanceAccountOneBefore = await contract.balanceOf(accounts[1]);
        assert.equal(0, balanceAccountOneBefore);
        await contract.buyTokens(accounts[1],{from:accounts[1], value:buyWei});
        var balanceAccountOneAfter = await contract.balanceOf(accounts[1]);
        await contract.transfer(contract.address,balanceAccountOneAfter,{from:accounts[1]});
        var balanceContractBefore = await contract.balanceOf(contract.address);

        assert.equal(Number(rate*buyWei/1e18).toFixed(0), balanceContractBefore);
        //console.log("balanceContractBefore = " + balanceContractBefore);
        var balanceOwnerBefore = await contract.balanceOf(owner);
        await contract.claimTokens(contract.address,{from:accounts[0]});
        var balanceContractAfter = await contract.balanceOf(contract.address);
        //console.log("balanceContractAfter = " + balanceContractAfter);
        assert.equal(0, balanceContractAfter);
        var balanceOwnerAfter = await contract.balanceOf(owner);
        assert.equal(true, balanceOwnerBefore<balanceOwnerAfter);

    });
});



