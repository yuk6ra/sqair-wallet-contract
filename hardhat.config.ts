import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import { HardhatUserConfig } from 'hardhat/config'
import 'hardhat-deploy'
import '@nomiclabs/hardhat-etherscan'
import 'solidity-coverage'

import 'dotenv/config'

const privateKey = process.env.PRIVATE_KEY as string

function getNetwork1 (url: string): { url: string, accounts: [privateKey: string] } {
  return {
    url,
    accounts: [privateKey]
  }
}

function getNetwork (name: string): { url: string, accounts: [privateKey: string] } {
  return getNetwork1(`https://${name}.infura.io/v3/${process.env.INFURA_ID}`)
  // return getNetwork1(`wss://${name}.infura.io/ws/v3/${process.env.INFURA_ID}`);
}

const optimizedComilerSettings = {
  version: '0.8.18',
  settings: {
    optimizer: { enabled: true, runs: 1000000 },
    viaIR: true
  }
}
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{
      version: '0.8.18',
      settings: {
        optimizer: { enabled: true, runs: 1000000 }
      }
    }],
    overrides: {
      'contracts/core/EntryPoint.sol': optimizedComilerSettings,
      'contracts/samples/SimpleAccount.sol': optimizedComilerSettings
    }
  },
  networks: {
    dev: { url: 'http://localhost:8545' },
    // github action starts localgeth service, for gas calculations
    localgeth: { url: 'http://localgeth:8545' },
    goerli: getNetwork('goerli'),
    sepolia: getNetwork('sepolia'),
    proxy: getNetwork1('http://localhost:8545'),
    mumbai: getNetwork('polygon-mumbai')
  },
  mocha: {
    timeout: 10000
  },

  etherscan: {
    apiKey: process.env.SCAN_API_KEY
  }

}

// coverage chokes on the "compilers" settings
if (process.env.COVERAGE != null) {
  // @ts-ignore
  config.solidity = config.solidity.compilers[0]
}

export default config
