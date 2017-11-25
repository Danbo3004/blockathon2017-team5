// var ethereumjsWallet = require('ethereumjs-wallet');
// var ProviderEngine = require("web3-provider-engine");
// var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
// var Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
// var Web3 = require("web3");
// var FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');

// // create wallet from existing private key
// // 0x740D5e924c587CcD7A0B2C5888afeC44eFd30eF0
// var privateKey = '8e1ec1e1aadffe2085e4a02e8a7b7ad8deafb961153cbabbc8442fe7fa24e2e0';
// var wallet = ethereumjsWallet.fromPrivateKey(new Buffer(privateKey, "hex"));
// var address = "0x" + wallet.getAddress().toString("hex");

// // using ropsten testnet
// var providerUrl = "https://rinkeby.infura.io/NLQOqKfqFUx5isRRyS4k";
// var engine = new ProviderEngine();

// // filters
// engine.addProvider(new FilterSubprovider());
// engine.addProvider(new WalletSubprovider(wallet, {}));
// engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)));
// engine.start(); // Required by the provider engine.

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    // rinkebyInfura: {
    //   network_id: 4,    // Official ropsten network id
    //   provider: engine, // Use our custom provider
    //   gas: 4600000,
    //   from: address     // Use the address we derived
    // },
  }  
};

// module.exports = {
//   networks: {
//     development: {
//       host: "localhost",
//       port: 8545,
//       network_id: "*" // Match any network id
//     },
//     rinkeby: {
//       host: "localhost", // Connect to geth on the specified
//       port: 8545,
//       from: "0xffe1e353697e93705d0c7ebe0a2755edd4447b98", // default address to use for any transaction Truffle makes during migrations
//       network_id: 4,
//       gas: 4612388 // Gas limit used for deploys
//     }
//   }
// };
