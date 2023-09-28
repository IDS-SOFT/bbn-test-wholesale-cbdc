import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('WholesaleCBDC', function () {
  let WholesaleCBDC: any;
  let wholesaleCBDCInstance: any;
  let accounts: any;

  before(async function () {
      accounts = await ethers.getSigners();
      // console.log(accounts[0].address);
      WholesaleCBDC = await ethers.getContractFactory('WholesaleCBDC');
    });
    
    beforeEach(async function () {
        wholesaleCBDCInstance = await WholesaleCBDC.deploy();
        await wholesaleCBDCInstance.deployed();
  });

  it('should deploy the smart contract properly', async function () {
    expect(wholesaleCBDCInstance.address).to.not.equal(0);
  });

  it('should issue CBDC to a participant bank', async function () {
    const recipient = accounts[1].address;
    const amount = 100;

    await wholesaleCBDCInstance.issueCBDC(recipient, amount);

    const balance = await wholesaleCBDCInstance.getCBDCBalance(recipient);
    expect(balance.toString()).to.equal(amount.toString());
  });

  it('should transfer CBDC between participant banks', async function () {
    const sender = accounts[1].address;
    const recipient = accounts[2].address;
    const initialBalance = 100;
    const transferAmount = 50;
    
    const senderAddressSigner = await ethers.getSigner(sender);

    await wholesaleCBDCInstance.issueCBDC(sender, initialBalance);
    // const secondInstance = await wholesaleCBDCInstance.connect(senderAddressSigner);
    await wholesaleCBDCInstance.connect(senderAddressSigner).transferCBDC(recipient, transferAmount);

    const senderBalance = await wholesaleCBDCInstance.getCBDCBalance(sender);
    const recipientBalance = await wholesaleCBDCInstance.getCBDCBalance(recipient);

    expect(senderBalance.toString()).to.equal((initialBalance - transferAmount).toString());
    expect(recipientBalance.toString()).to.equal(transferAmount.toString());
  });

  it('should not transfer CBDC if the sender has an insufficient balance', async function () {
    const sender = accounts[1].address;
    const recipient = accounts[2].address;
    const initialBalance = 50;
    const transferAmount = 100;

    await wholesaleCBDCInstance.issueCBDC(sender, initialBalance);

    try {
      await wholesaleCBDCInstance.transferCBDC(recipient, transferAmount);
      expect.fail('Transfer should have failed');
    } catch (error:any) {
      expect(error.message).to.include('Insufficient CBDC balance');
    }
  });

// Add more test cases as needed...

//   it('should convert CBDC to USD', async function () {
//     // Write test case for the convertToUSD function here.
//   });

//   it('should convert USD to CBDC', async function () {
//     // Write test case for the convertToCBDC function here.
//   });

  it('should check the CBDC balance of a user', async function () {
    const userAccount = accounts[1].address;
    const initialBalance = 200;

    await wholesaleCBDCInstance.issueCBDC(userAccount, initialBalance);

    const balance = await wholesaleCBDCInstance.getCBDCBalance(userAccount);
    expect(balance.toString()).to.equal(initialBalance.toString());
  });
});
