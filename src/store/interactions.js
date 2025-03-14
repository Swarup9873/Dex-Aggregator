import { ethers } from 'ethers'

import {
  setProvider,
  setNetwork,
  setAccount
} from './reducers/provider'

import {
  setSymbols,
  //balancesLoaded
} from './reducers/tokens'

import {
  // swapsLoaded,
  setIsSwapping,
  setSwapSuccess,
  setSwapFail
} from './reducers/aggregator'


export const loadProvider = (provider, dispatch) => {
  dispatch(setProvider(provider))

  return provider
}

export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork()
  dispatch(setNetwork(chainId.toString()))

  return chainId
}

export const loadAccount = async (dispatch) => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const account = ethers.getAddress(accounts[0])
  dispatch(setAccount(account))

  return account
}

// ------------------------------------------------------------------------------
// LOAD CONTRACTS

// export const loadTokens = async (erc20s, dispatch) => { 
//   console.log("load tokens called")
//   let symbols = new Map()
//   let i = 0
//   // for (i=0; i < erc20s.length; i++){
//   //   symbols.set(await erc20s[i].symbol(), await erc20s[i].getAddress())
//   // }
//   for (i=0; i < erc20s.length; i++){
//     symbols.set(await erc20s[i].getAddress())
//   }
//   console.log("load tokens finished")
//   dispatch(setSymbols(symbols))
//   console.log('symbols:', symbols)
//   return symbols

// }



export const loadTokens = async (erc20s, dispatch) => {
  try {
    // console.log('Loading tokens...');
    let symbols = new Map();

    for (let i = 0; i < erc20s.length; i++) {
      const tokenInstance = erc20s[i];

      // Fetch symbol and address
      try {
        const symbol = await tokenInstance.symbol();
        const address = tokenInstance.target; // Directly access the address via target property
        // console.log('Fetching symbol for token:', address, symbol);

        // Check if symbol is valid before setting in Map
        if (symbol) {
          symbols.set(address, symbol);
        } else {
          console.warn(`Symbol for address ${address} is undefined or empty.`);
        }
      } catch (error) {
        console.error(`Error fetching symbol for token at address ${tokenInstance.target}:`, error);
      }
    }

    dispatch(setSymbols(symbols));
    // console.log('Symbols loaded:', symbols);
    return symbols;
  } catch (error) {
    console.error('Error loading tokens:', error);
    throw error; // Ensure errors are propagated for further debugging
  }
};





// export const loadTokens = async (erc20s, dispatch) => {
//   try {
//     console.log('Loading tokens...');
//     let symbols = new Map();
//     for (let i = 0; i < erc20s.length; i++) {
//       const tokenInstance = erc20s[i];
//       console.log('Fetching symbol for token:', tokenInstance.target);
//       // const symbol = await tokenInstance.symbol();
//       const address = await tokenInstance.getAddress();
//       symbols.set(address);
//     }
//     dispatch(setSymbols(symbols));
//     console.log('Symbols loaded:', symbols);
//     return symbols;
//   } catch (error) {
//     console.error('Error loading tokens:', error);
//     throw error; // Ensure errors are propagated for further debugging
//   }
// };



// export const fetchTokens = (contracts) => {
//   return async dispatch => {
//     try {
//       dispatch(setSymbols([await contracts.dai.symbol(), await contracts.weth.symbol()]))
//     } catch (error) {
//       console.error('Error fetching tokens info: ', error);
//       // Optionally dispatch an error action
//       // dispatch(fetchDataError(error));
//     }
//   };
// };


// ------------------------------------------------------------------------------
// LOAD BALANCES

// export const loadBalances = async (tokens, account, dispatch) => {
//   const balance1 = await tokens[0].balanceOf(account)
//   const balance2 = await tokens[1].balanceOf(account)

//   dispatch(balancesLoaded([
//     ethers.formatUnits(balance1.toString(), 'ether'),
//     ethers.formatUnits(balance2.toString(), 'ether')
//   ]))

// }


// SWAP

 export const swap = async (provider, contracts, path, router, amount, minAmountOut, slippage, deadline, dispatch) => {

  try{
     dispatch(setIsSwapping(true))

     let transaction
     const signer = await provider.getSigner()

     transaction = await contracts.dai.connect(signer).approve(contracts.aggregator.getAddress(), amount)
     await transaction.wait();
     console.log('Approval transaction hash:', transaction.hash);


     transaction = await contracts.aggregator.connect(signer)
       .swapOnUniswapFork(
        path,
        router,
        amount,
        minAmountOut,
        slippage,
        deadline
        ) 

     await transaction.wait()

     dispatch(setSwapSuccess(transaction.hash))


  } catch (error) {
    console.error('Swap failed:', error);
    dispatch(setSwapFail())
  }
}


// ------------------------------------------------------------------------------
// LOAD ALL SWAPS

// export const loadAllSwaps = async (provider, aggregator, dispatch) => {
//   const block = await provider.getBlockNumber()

//   const swapStream = await aggregator.queryFilter('Swap', 0, block)

//   const swaps = swapStream.map(event => {
//     return { hash: event.transactionHash, args: event.args }
//   })

//   dispatch(swapsLoaded(swaps))
// }
