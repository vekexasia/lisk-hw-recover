# Lisk Hardware Wallet Recoverer

This tool will let you recover your lisk funds from a ledger or trezor hardware wallet which is known to be not supported at the time I am writing this.

## Disclaymer

This tool has no guarantee to function properly although it has been tested by a few. If you use this you'll have to do it at your own risk.

## How does it work?

You'll have to enter your Ledger seed when asked and the tool will look for accounts with funds in it.

After discovery you will be prompted a recipient address to send funds to.

## Security Concerns

The seed is the most sensitive information you can have. With that an attacker could potentially steal everything that is "stored inside" your hardware wallet (not just your lisk belongings).

This tool is no exception. You should take care about downloading this from a trusted source and you should never give away your seed to anyone (even the tool authors).

This tool does not store your mnemonic seed anywhere and is open-source so that you can clearly see what the code does.

## How to install.

Pre-requisites: 

 - Node.js v12 (use `nvm` or whatever to get that installed)
 - Yarn (use `npm i -g yarn` to install)
 - A brand new lisk address to send the "locked" funds.

Bash commands:

 - git clone https://github.com/vekexasia/lisk-hw-recover
 - cd lisk-hw-recover
 - yarn

## How to run

To run you just need to issue the following command from within the `lisk-hw-recover` folder:

```
./node_modules/.bin/ts-node ./src/index.ts
```

After that the script will ask for the mnemonic seed and guide you through the process of sending your funds to another address of your choice.

## Successfully recovered?

After you successfully recover your funds you might express your gratitude by voting **vekexasia** and/or **corsaro** as your delegate.  

## The program exists right after inserting the mnemonic.

This means that either the mnemonic is wrong or that there is no funds in the first associated ledger address.

## Other credits

Kudos to alepop, hirish and dakkk all of which this tool might have not been possible to create so easily.


