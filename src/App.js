import { useState } from 'react';
import { flushSync } from 'react-dom';
import Web3 from 'web3';
import './App.css';

function App() {
  const provider = new Web3(Web3.givenProvider);
  const web3 = new Web3(provider);
  const addressContract = '0x24be1eed80a30a203f0281730E0481A9D376f838';
  const ABI = [{"inputs": [{"internalType": "string","name": "name","type": "string"},{"internalType": "int256","name": "age","type": "int256"},{"internalType": "uint256","name": "money","type": "uint256"},{"internalType": "address","name": "wallet","type": "address"}],"name": "addGrandChild","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"stateMutability": "nonpayable","type": "constructor"},{"inputs": [{"internalType": "address","name": "","type": "address"}],"name": "allChild","outputs": [{"internalType": "string","name": "name","type": "string"},{"internalType": "int256","name": "age","type": "int256"},{"internalType": "uint256","name": "money","type": "uint256"},{"internalType": "address","name": "wallet","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "getLenghtGrandChild","outputs": [{"internalType": "int256","name": "","type": "int256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "walletChild","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"}] 
  const contract = new web3.eth.Contract(ABI, addressContract);
  // const [grandChildInfo,setGrandChildInfo] = useState(false);
  const [name, setName] = useState();
  const [age, setAge] = useState();
  const [money, setMoney] = useState();
  const [address, setAddress] = useState();
  const [grandChildLength,setGrandChildLength] = useState();
  async function addGrandChild() {
    const account = await connectAccount();
    const infoInput = checkInput();
    if(typeof infoInput == "undefined") {
      console.log("Заполните информацию внука");
      if(document.querySelector('#name').value == "") document.querySelector('#name').style.border = '1px solid red';
      if(document.querySelector('#age').value == "") document.querySelector('#age').style.border = '1px solid red';
      if(document.querySelector('#money').value == "") document.querySelector('#money').style.border = '1px solid red';
      if(document.querySelector('#address').value == "") document.querySelector('#address').style.border = '1px solid red';
      return;
    }else {
      document.querySelector('#name').style.border = '1px solid #fff'
      document.querySelector('#age').style.border = '1px solid #fff'
      document.querySelector('#money').style.border = '1px solid #fff'
      document.querySelector('#address').style.border = '1px solid #fff'
    }
    
    const addChild = await contract.methods.addGrandChild(infoInput[0], infoInput[1], infoInput[2],infoInput[3]).send({from: account}).then(console.log("Новый внук добавлен"));
    setGrandChildLength(await getGrandChildLength());
    console.log(await getGrandChildLength());
    console.log(addChild);
  }
  async function getGrandChildLength() {
    return await contract.methods.getLenghtGrandChild().call();
  } 
  
  async function searchGrandChild() {
    const valueGrandChild = document.getElementById('searchaddress').value;
    if(valueGrandChild == "") {
      console.log("Заполните поле");
      document.getElementById('searchaddress').style.border = "1px solid red";
      return;
    }else {
      document.getElementById('searchaddress').style.border = "1px solid #fff";
    }
    const infoGrandChild = await contract.methods.allChild(valueGrandChild).call().then(console.log("Мы нашли внука!"));
    console.log(infoGrandChild);
    flushSync(()=>{
      setName(infoGrandChild.name);
      setAge(infoGrandChild.age);
      setMoney(infoGrandChild.money);
      setAddress(infoGrandChild.wallet);
    })
  }
  function checkInput() {
    if(document.querySelector('#name').value == "" || document.querySelector('#age').value == ""|| document.querySelector('#money').value == "", document.querySelector('#address').value == "") return;
    return [document.querySelector('#name').value,document.querySelector('#age').value,document.querySelector('#money').value,document.querySelector('#address').value];
  }
  async function connectAccount() {
    if(typeof window.ethereum == "undefined") {
      console.log("metamask is installed");
      return;
    }
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    const account = accounts[0];
    // console.log(account);
    return account;
  }
  return (
    <div className="App">
      <div className='addGrandChild'>
        <h2>Добавить внука</h2>
        <div className='infoGrandChild'>
          <label>Имя внука</label>
          <input type="text" id='name'/>
          <label >Возраст внука</label>
          <input type="number" id='age'/>
          <label >Сколько денег у внука</label>
          <input type="number" id='money'/>
          <label>Адрес кошелька внука</label>
          <input type="text" id='address'/>
          <button className='btn-add' onClick={addGrandChild}>Добавить</button>
        </div>
        <h2>Всего внуков:</h2>
        <span>{grandChildLength}</span>
      </div>
      <div className='search'>
        <h2>Поиск внука по адресу</h2>
        <div className='search-content'>
          <label>Адрес внука</label>
          <input type="text" id='searchaddress'/>
          <div>
            <p>Имя:<span>{name}</span></p>
            <p>Возраст:<span>{age}</span></p>
            <p>Денег:<span>{money}</span></p>
            <p>Адрес:<span className='adrs'>{address}</span></p>
          </div>
          <button className='btn-search' onClick={searchGrandChild}>Поиск</button>
        </div>
      </div>
    </div>
  );
}

export default App;
