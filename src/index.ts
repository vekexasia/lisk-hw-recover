import {getPublicKey, signTransaction} from "@lisk-builders/lisk-hd-key";
import {apiClient, transactions} from '@liskhq/lisk-client';
import * as cryptography from '@liskhq/lisk-cryptography';
import * as bip39 from 'bip39'
import * as inquirer from 'inquirer';
import 'colors';
import {TransferAssetSchema} from "./sendSchema";

const RPC_ENDPOINT = 'wss://lisk-mainnet-api.liskworld.info/ws';

async function doRecover() {
  const {disclaimer} = await inquirer.prompt([{
    name: 'disclaimer',
    default: false,
    type: 'confirm',
    message: 'Did you read the README file and accept/understand everything that is written into it?'
  }]);
  if (!disclaimer) {
    return false;
  }
  const {seed} = await inquirer.prompt([{
    name: 'seed',
    message: 'Please enter your HW wallet mnemonic seed:',
    type: 'password'
  }]);
  const hexSeed = await bip39.mnemonicToSeed(seed);
  const client = await apiClient.createWSClient(RPC_ENDPOINT);
  let i = 0;
  let lastBalance = 0n;
  do {
    let path = `m/44'/134'/${i}'`;

    const publicKey = getPublicKey(path, hexSeed.toString('hex'));
    const address = cryptography.getAddressFromPublicKey(publicKey);
    const legacyaddress = cryptography.getLegacyAddressFromPublicKey(publicKey);
    const addrData = await processAccount(address);
    lastBalance = addrData.balance;
    if (addrData.balance > 0n) {
      const {recover} = await inquirer
        .prompt([{
          name: 'recover',
          type: 'confirm',
          message: `Trying to recover ${legacyaddress} with new address being ${addrData.address.in32Format}?`
        }]);

      const {send} = await inquirer
        .prompt([{
          name: 'send',
          type: 'confirm',
          message: `Do you want to send out ${addrData.prettyBalance} LSK to another address?`
        }])
      if (send) {
        const {recipient} = await inquirer
          .prompt([{
            name: 'recipient',
            message: `Type the recipient address`,
            validate(input: any): boolean | string | Promise<boolean | string> {
              if (cryptography.validateLisk32Address(input)) {
                return true;
              }
              return 'Address invalid';
            }
          }]);

        const {lastConf} = await inquirer
          .prompt([{
            name: 'lastConf',
            type: 'confirm',
            default: false,
            message: `Are you sure you would like to send ${addrData.prettyBalance} LSK to ${recipient}?`
          }]);

        if (lastConf) {
          const unsignedTransaction = {
            moduleID: 2,
            assetID: 0,
            nonce: addrData.nonce,
            fee: BigInt(243000),
            senderPublicKey: publicKey, // If not provided, it will be set automatically
            asset: {
              amount: addrData.balance,
              recipientAddress: cryptography.getAddressFromLisk32Address(recipient), // self-transfer
              data: 'Recovered with lisk-hw-recover by vekexasia and corsaro',
            }
          };
          // Populate amounts.
          unsignedTransaction.fee = transactions.computeMinFee(TransferAssetSchema.schema, unsignedTransaction);
          unsignedTransaction.asset.amount = addrData.balance - unsignedTransaction.fee - 5000000n;

          const signedTx = signTransaction(hexSeed.toString('hex'), path, unsignedTransaction);
          // const txBroadcastBytes = transactions.getBytes(TransferAssetSchema.schema, signedTx);
          try {
            const {transactionId} = await client.transaction.send(signedTx);
            console.log(`Success: TxId -> ${transactionId}`);
          } catch (e) {
            console.log(`Error!`, e.message);
          }
        }
      }
    }
    i++;
    // }
  } while (lastBalance > 0n);
  console.log('');
  console.log(`If you found this tool useful. ${'Please consider voting'.underline} ${'vekexasia'.bold} and ${'corsaro'.bold}. The authors of this tool!`)
  process.exit(0);

}

async function processAccount(binaryAddr: Buffer): Promise<{ address: { binary: Buffer, in32Format: string }, nonce: bigint, balance: bigint, prettyBalance: string }> {
  const client = await apiClient.createWSClient(RPC_ENDPOINT);
  try {
    const acct: any = await client.account.get(binaryAddr);
    return {
      address: {
        binary: binaryAddr,
        in32Format: cryptography.getLisk32AddressFromAddress(binaryAddr, 'lsk'),
      },
      nonce: acct.sequence.nonce,
      balance: acct.token.balance,
      prettyBalance: `${(acct.token.balance / 100000000n)}.${('00000000' + (acct.token.balance % 100000000n)).slice(-8)}`
    }
  } catch (e) {
    return {
      address: {
        binary: binaryAddr,
        in32Format: cryptography.getLisk32AddressFromAddress(binaryAddr, 'lsk'),
      },
      nonce: 0n,
      balance: 0n,
      prettyBalance: '0'
    }
  }
}

doRecover();
// processAccount(Buffer.from('9ede5dbbc3dd1ec958a66d78156f537e8c0e4e01', 'hex')).then(console.log)
// const hexSeed = await bip39.mnemonicToSeed(seed);
