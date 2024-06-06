import {use_State, use_Effect} from "react";
import {ethers} from "ethers";
import atm_abi from "../SCP/ASSESSMENT.sol";
export default function HomePage() {
  const [eth_Wallet, set_Eth_Wallet] = use_State(undefined);
  const [account, setAccount] = use_State(undefined);
  const [atm, setATM] = use_State(undefined);
  const [balance, setBalance] = use_State(undefined);
  const contract_Address = " 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
  const atm = atm_abi.abi;
  const get_Wallet = async() => {
    if (window.ethereum) {
      set_Eth_Wallet(window.ethereum);
    }

    if (eth_Wallet) {
      const account = await eth_Wallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }
  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected--> ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }
  const connectAccount = async() => {
    if (!eth_Wallet) {
      alert('honey wallet is required to connect');
      return;
    }
    const accounts = await eth_Wallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    getATMContract();
  };
  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(eth_Wallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contract_Address, atm, signer);
    setATM(atmContract);
  }
  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }
  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }
  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }
  const initUser = () => {
    if (!eth_Wallet) {
      return <p>Please install Honey in order to use this ATM.</p>
    }
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Honey wallet</button>
    }
    if (balance == undefined) {
      getBalance();
    }
    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
      </div>
    )
  }
  use_Effect(() => {get_Wallet();}, []);
  return (
    <main className="container">
      <header><h1>hello to the Honey ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
       '}
      </style>
    </main>
  )
}
