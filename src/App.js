import React, { useEffect, useState, useRef } from "react";
import { newKitFromWeb3 } from "@celo/contractkit";
import "@celo-tools/use-contractkit/lib/styles.css";
import Web3 from "@celo/contractkit/node_modules/web3";
import abi from "./abis/TokenList.abi.json";
import celo_abi from "./abis/erc20.abi.json"

// react notification library imports
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const byte_code = `60806040523480156200001157600080fd5b5060405162000f4f38038062000f4f833981810160405260608110156200003757600080fd5b81019080805160405193929190846401000000008211156200005857600080fd5b838201915060208201858111156200006f57600080fd5b82518660018202830111640100000000821117156200008d57600080fd5b8083526020830192505050908051906020019080838360005b83811015620000c3578082015181840152602081019050620000a6565b50505050905090810190601f168015620000f15780820380516001836020036101000a031916815260200191505b50604052602001805160405193929190846401000000008211156200011557600080fd5b838201915060208201858111156200012c57600080fd5b82518660018202830111640100000000821117156200014a57600080fd5b8083526020830192505050908051906020019080838360005b838110156200018057808201518184015260208101905062000163565b50505050905090810190601f168015620001ae5780820380516001836020036101000a031916815260200191505b50604052602001805190602001909291905050508260009080519060200190620001da929190620002d8565b508160019080519060200190620001f3929190620002d8565b506012600260006101000a81548160ff021916908360ff160217905550670de0b6b3a76400008102600381905550600354600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef6003546040518082815260200191505060405180910390a350505062000387565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200031b57805160ff19168380011785556200034c565b828001600101855582156200034c579182015b828111156200034b5782518255916020019190600101906200032e565b5b5090506200035b91906200035f565b5090565b6200038491905b808211156200038057600081600090555060010162000366565b5090565b90565b610bb880620003976000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c80633eaaf86b116100665780633eaaf86b1461025457806370a082311461027257806395d89b41146102ca578063a9059cbb1461034d578063dd62ed3e146103b35761009e565b806306fdde03146100a3578063095ea7b31461012657806318160ddd1461018c57806323b872dd146101aa578063313ce56714610230575b600080fd5b6100ab61042b565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100eb5780820151818401526020810190506100d0565b50505050905090810190601f1680156101185780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101726004803603604081101561013c57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506104c9565b604051808215151515815260200191505060405180910390f35b6101946105bb565b6040518082815260200191505060405180910390f35b610216600480360360608110156101c057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610606565b604051808215151515815260200191505060405180910390f35b610238610881565b604051808260ff1660ff16815260200191505060405180910390f35b61025c610894565b6040518082815260200191505060405180910390f35b6102b46004803603602081101561028857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061089a565b6040518082815260200191505060405180910390f35b6102d26108e3565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156103125780820151818401526020810190506102f7565b50505050905090810190601f16801561033f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6103996004803603604081101561036357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610981565b604051808215151515815260200191505060405180910390f35b610415600480360360408110156103c957600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610afc565b6040518082815260200191505060405180910390f35b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104c15780601f10610496576101008083540402835291602001916104c1565b820191906000526020600020905b8154815290600101906020018083116104a457829003601f168201915b505050505081565b600081600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b6000600460008073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205460035403905090565b600081600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205403600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555081600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205403600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555081600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190509392505050565b600260009054906101000a900460ff1681565b60035481565b6000600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109795780601f1061094e57610100808354040283529160200191610979565b820191906000526020600020905b81548152906001019060200180831161095c57829003601f168201915b505050505081565b600081600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205403600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555081600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905092915050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490509291505056fea265627a7a7231582046242e736e96431941cc468f044c94f023c2d6dbb1251786c2ff8e25e348b88564736f6c63430005110032`;
const tokenListAddress = `0x56410C8Ed85b8502025776A966026EfD7Dbbeac2`;

const App = () => {
  const [loading, setloading] = useState(false);
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  // form state
  const [tokenName, settokenName] = useState(null);
  const [tokenSymbol, settokenSymbol] = useState(null);
  const [decimals, setdecimals] = useState(18);
  const [totalSupply, settotalSupply] = useState(0);

  // store all the listed tokens
  const [listedTokens, setListedTokens] = useState([]);

  const [txHash, settxHash] = useState(null);
  // the user deployed token
  const [contractAddress, setcontractAddress] = useState(null);

  const ERC20_DECIMALS = 18;
  useEffect(() => {
    connectCeloWallet();
  }, []);

  const connectCeloWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];

        kit.defaultAccount = user_address;

        await setAddress(user_address);

        await setKit(kit);
        toast.success("Connected to the celo blockchain successfully");
      } catch (error) {
        console.log({ error });
        toast.error("Failed to connect to the celo blockchain");
      }
    } else {
      toast.error("Please install the celo wallet extension to use this Dapp");
    }
  };

  useEffect(() => {
    if (kit && address) {
      const contract = new kit.web3.eth.Contract(abi, tokenListAddress);
      setcontract(contract);
    }
  }, [kit, address]);

  useEffect(() => {
    if (contract) {
      return fetchTokenList();
    }
  }, [contract]);

  const getBalance = async () => {
    setloading(true);
    const balance = await kit.getTotalBalance(address);
    const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

    setcUSDBalance(USDBalance);
    setloading(false);
  };

  // add the token to the listing
  const listToken = async () => {
  const result =   await contract.methods
      .addTokenList(tokenName, tokenSymbol, totalSupply)
      .send({ from: address });
    return result
  };

  const fetchTokenList = async () => {
    const tokenLength = await contract.methods.getTokenLength().call();

    const _tokens = [];

    // start with 0 here because indexing stars from 0 in our smart contract
    for (let i = 0; i < tokenLength; i++) {
      let promise = new Promise(async (resolve, reject) => {
        let _token = await contract.methods.getToken(i).call();
console.log({_token})
        resolve({
          index: _token[0],
          owner: _token[1],
          token_name: _token[2],
          token_symbol: _token[3],
          total_supply: _token[4],
        });
      });
      _tokens.push(promise);
    }
    const resloved_tokens = await Promise.all(_tokens);

    setListedTokens(resloved_tokens);

    console.log({resloved_tokens})
    toast.success("Fetched latest tokens");
  };

  useEffect(() => {
    if (kit && address) {
      return getBalance();
    } else {
      console.log("no kit or address");
    }
  }, [kit, address]);

  const deployToken = async () => {
    console.log({ tokenName, tokenSymbol, decimals, totalSupply });
    if (!tokenName || !tokenSymbol || !decimals || !totalSupply) {
      return toast.error("Please enter all fields");
    }
    if (Number(totalSupply) < 1) {
      return toast.error("Please enter a valid amount");
    }

    toast.info("Waiting for contract to be deployed..");
    var standardtokenContract = new kit.web3.eth.Contract(celo_abi);
    standardtokenContract
      .deploy({
        data: "0x" + byte_code,
        arguments: [tokenName, tokenSymbol, Number(totalSupply)],
      })
      .send(
        {
          from: address,
        },
        function (error, transactionHash) {
          if (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again");
            return;
          }
          console.log("Transaction Hash :", transactionHash);

          // set the deployed tx hash

          settxHash(transactionHash);

          toast.info(
            "Contract deployment is in progress - please be patient. If nothing happens for a while check if there's any errors in the console (hit F12)"
          );
   }
      )
      .on("confirmation", function () {
        return;
      })
      .then(async (newContractInstance) =>{
        if (!newContractInstance.options.address) {
          return;
        }
 
        var newContractAddress = newContractInstance.options.address;
       await setcontractAddress(newContractAddress);

        toast.success(
          `Contract deployed at address ${newContractAddress} - keep a record of this. `
        );

        toast.info("Lets save this data to the blockchain");
       const result = await listToken()

       if(result){
        toast.info("Your token has been listed successfully");
       }else{
        toast.error("Failed to list your token");
       }

        toast.info(
          "You can click the link below your newly deployed contract address to learn how to add your custom token to Metamask"
        );

        fetchTokenList()
      })
      .catch(function (error) {
        console.error(error);
        toast.error("Deployment failed. Please try again");
      });
    // return result

    return;
  };

  return (
    <div id="wrapper">
      <ToastContainer
        position="top-right"
        autoClose={7000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* header begin */}
      <header className="transparent">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="de-flex sm-pt10">
                <div className="de-flex-col">
                  <div className="de-flex-col">
                    {/* logo begin */}
                    <div id="logo">
                      <a href="/">
                        {/* <img alt="" src="images/logo-light.png" /> */}
                        <h3>Celo Token Generator</h3>
                      </a>
                    </div>
                    {/* logo close */}
                  </div>
                </div>
                <div className="de-flex-col header-col-mid">
                  <div className="menu_side_area">
                    {!address ? (
                      <button
                        onClick={() => {
                          connectCeloWallet();
                        }}
                        className="btn-main"
                      >
                        Connect Wallet
                      </button>
                    ) : (
                      <button disabled className="btn-main">
                        Connected!!
                      </button>
                    )}

                    <span id="menu-btn" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* header close */}
      {/* content begin */}
      <div className="no-bottom no-top" id="content">
        <div id="top" />
        <section
          className="full-height relative no-top no-bottom vertical-center"
          data-bgimage="url(images/background/subheader-dark.jpg) top"
          data-stellar-background-ratio=".5"
        >
          <div className="overlay-gradient t50">
            <div className="center-y relative">
              <div className="container">
                <div className="row align-items-center">
                  <div
                    className="col-lg-5 text-light wow fadeInRight"
                    data-wow-delay=".5s"
                  >
                    <div className="spacer-10" />
                    <h1>Create your Custom Token</h1>
                    <p className="lead">
                      create and deploy your custom ERC20 token on the Celo
                      Blockchain all with a click of button.
                    </p>
                  </div>
                  <div
                    className="col-lg-4 offset-lg-2 wow fadeIn"
                    data-wow-delay=".5s"
                  >
                    <div
                      className="box-rounded padding40"
                      data-bgcolor="#21273e"
                    >
                      <h3 className="mb10">Get Started</h3>
                      <p>Fill in the for below to deploy your custom token .</p>
                      <p>
                        {address} ({cUSDBalance} cUSD).
                      </p>
                      <form
                        name="contactForm"
                        id="contact_form"
                        className="form-border"
                      >
                        
                        <div className="field-set">
                          <input
                            type="text"
                            required
                            name="token_name"
                            id="token_name"
                            className="form-control"
                            placeholder="Token Name"
                            onChange={(e) => {
                              settokenName(e.target.value);
                            }}
                          />
                        </div>
                        <div className="field-set">
                          <input
                            type="text"
                            required
                            name="token_symbol"
                            id="token_symbol"
                            className="form-control"
                            placeholder="Token Symbol"
                            onChange={(e) => {
                              settokenSymbol(e.target.value);
                            }}
                          />
                        </div>
                        <div className="field-set">
                          <input
                            type="text"
                            name="decimals"
                            id="decimals"
                            className="form-control"
                            placeholder="Token decimals"
                            value={18}
                            disabled
                          />
                        </div>
                        <div className="field-set">
                          <input
                            type="text"
                            required
                            name="total_supply"
                            id="total_supply"
                            className="form-control"
                            onChange={(e) => {
                              settotalSupply(Number(e.target.value));
                            }}
                            placeholder="Total Token Supply"
                          />
                        </div>

                        <div className="field-set">
                          <input
                            type="submit"
                            id="send_message"
                            defaultValue="Submit"
                            onClick={deployToken}
                            className="btn btn-main btn-fullwidth color-2"
                          />
                        </div>
                        <div className="clearfix" />
                        <div className="spacer-single" />

                        {contractAddress && (
                          <>
                            <div className="spacer-single" />

                            <h3 className="mb10">Transaction details</h3>
                            <p>Deployed {tokenSymbol} Token Address : </p>
                            <p>{contractAddress}</p>

                            <p>Transaction Hash : </p>
                            <p>
                              {" "}
                              <a
                                target="_blank"
                                href={`https://alfajores-blockscout.celo-testnet.org/tx/${txHash}`}
                              >
                                Click to your transaction on Alfajores testnet
                                explorer
                              </a>{" "}
                            </p>
                            <div className="spacer-single" />

                            <p>
                              Click{" "}
                              <a
                                href="https://docs.celo.org/getting-started/wallets/using-metamask-with-celo/manual-setup"
                                target="_blank"
                              >
                                Here
                              </a>{" "}
                              to learn how to add your custom token to Metamask
                            </p>
                          </>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-popular">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center">
                  <h2>Latest Tokens</h2>
                  <div className="small-border bg-color-2" />
                </div>
              </div>
              <div className="col-md-12 wow fadeIn">
                <ol className="author_list">
                  {listedTokens.map((_token, key) => (
                    <li>
                      <div className="author_list_pp">
                        <a href>
                          <img
                            className="lazy"
                            src="/images/author/author-9.jpg"
                            alt=""
                          />
                          <i className="fa fa-check" />
                        </a>
                      </div>
                      <div className="author_list_info">
                        <a href>{_token.token_name}</a>
                        <span>{_token.total_supply} {_token.token_symbol}</span>
                      </div>
                    </li>
                  ))}

                  
                </ol>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* content close */}
      {/* footer begin */}
      <footer>
        <div className="subfooter">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="de-flex">
                  <div className="de-flex-col">
                    <a href="/">
                      <h3>Celo Token Generator</h3>
                      <span className="copy">© Copyright 2021 - Dacade</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* footer close */}
    </div>
  );
};

export default App;
