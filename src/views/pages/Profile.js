import React, { useState, useEffect } from "react";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardImg,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Container,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Modal,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Row,
  Col,
} from "reactstrap";

import classnames from "classnames";

// core components
import LogoutNav from "components/Navbars/LogoutNav.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import Login from "views/pages/Login.js";

// wallet
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Fortmatic from "fortmatic";
import Torus from "@toruslabs/torus-embed";
import Portis from "@portis/web3";
import Authereum from "authereum";

import {
  useMoralis,
  useMoralisCloudFunction,
  useNFTBalances,
} from "react-moralis";

// Mail
import emailjs from '@emailjs/browser';

function Profile() {
  const contractAddressEthereum = "0x4bFa92483a42692B3e64B6cD0b85886b67114656";
  const contractAddressPolygon = "0x5bedE0f54C46cA01DE1C6DAE862753973025D67A";
  const contractAddressBSC = "0x4063dC37411a57D4c87599128EcAE5ea132d3594";
  const contractAddressAvalanche = "0x7BfDea4Cfb68286dE27d339F0eb6B9411d398287";
  const saturnABI = [
    {
      inputs: [
        { internalType: "uint256", name: "updateInterval", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        { internalType: "address", name: "_tokenAddress", type: "address" },
        { internalType: "uint256", name: "_tokenId", type: "uint256" },
        { internalType: "address", name: "_nominee", type: "address" },
      ],
      name: "Nominate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
      name: "checkUpkeep",
      outputs: [
        { internalType: "bool", name: "upkeepNeeded", type: "bool" },
        { internalType: "bytes", name: "", type: "bytes" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_nominationId", type: "uint256" },
      ],
      name: "executeTransfer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_nominationId", type: "uint256" },
      ],
      name: "initiateFetchRequest",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "interval",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "lastTimeStamp",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "nominationIds",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "nominations",
      outputs: [
        { internalType: "uint256", name: "nominationId", type: "uint256" },
        {
          internalType: "contract IERC721",
          name: "tokenAddress",
          type: "address",
        },
        { internalType: "uint256", name: "tokenID", type: "uint256" },
        { internalType: "address", name: "nominatedBy", type: "address" },
        { internalType: "address", name: "nominee", type: "address" },
        { internalType: "bool", name: "fetchRequestInitiated", type: "bool" },
        {
          internalType: "uint256",
          name: "fetchRequestInitiatedAt",
          type: "uint256",
        },
        { internalType: "bool", name: "fetched", type: "bool" },
        { internalType: "bool", name: "valid", type: "bool" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
      name: "performUpkeep",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_nominationId", type: "uint256" },
      ],
      name: "rejectFetchRequest",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const tokenABI = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "balance",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "_approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const toggleNavs = (e, state, index) => {
    e.preventDefault();
    setToggleState(index);
  };

  const toggleModal = () => {
    setModalState(!modal);
  };

  const [nftList, setNFTList] = useState([]);
  const [nominatedList, setNominatedList] = useState([]);
  const [inheritList, setInheritList] = useState([]);

  const [state, setToggleState] = useState(1);
  const [modal, setModalState] = useState(false);
  const [network, setNetwork] = useState(0);

  const [loading, setLoading] = useState(false);
  const [nomineeAddress, setNomineeAddress] = useState("");

  const [provider, setProvider] = useState("");
  const [userAddress, setAccount] = useState("");

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    // this.refs.main.scrollTop = 0;
  }, []);

  const {
    Moralis,
    authenticate,
    signup,
    login,
    isAuthenticated,
    user,
    setUserData,
    userError,
    isUserUpdating,
    logout,
    isAuthenticating,
    enableWeb3,
  } = useMoralis();

  const { getNFTBalances, data, error, isLoading, isFetching } =
    useNFTBalances();


  const INFURA_ID = "460f40a260564ac4a4f4b3fffb032dad";

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID, // required
      },
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK, // Required
      options: {
        appName: "My Awesome App", // Required
        infuraId: INFURA_ID, // Required
        //rpc: "", // Optional if `infuraId` is provided; otherwise it's required
        //chainId: 1, // Optional. It defaults to 1 if not provided
        darkMode: false, // Optional. Use dark theme, defaults to false
      },
    },
    fortmatic: {
      package: Fortmatic, // required
      options: {
        key: "FORTMATIC_KEY", // required,
        //network: customNetworkOptions // if we don't pass it, it will default to localhost:8454
      },
    },
    torus: {
      package: Torus, // required
      options: {
        networkParams: {
          host: "https://localhost:8545", // optional
          chainId: 1337, // optional
          networkId: 1337, // optional
        },
        config: {
          buildEnv: "development", // optional
        },
      },
    },
    portis: {
      package: Portis, // required
      options: {
        id: "PORTIS_ID", // required
      },
    },
    authereum: {
      package: Authereum, // required
    },
  };

  const web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions, // required
  });

  const connectWallet = async () => {
    setLoading(true);


    var provider = await web3Modal.connect();
    console.log(provider);
    setProvider(provider);
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    setAccount(accounts[0]);
    const y = enableWeb3({ onComplete: () => Moralis.link(accounts[0]) });
    console.log(y);
    setLoading(false);    
  };

  const getUserEthereumNFT = async (count, addressArray) => {
    setLoading(true);
    setNFTList([]);
    setInheritList([]);
    setNominatedList([]);
    var i = 0;
    var j = 0;
    for (i = 0; i < count; i++) {
      console.log(addressArray[i]);
      const ethereumNFT = await getNFTBalances({
        params: { chain: "rinkeby", address: addressArray[i] },
      });
      console.log(ethereumNFT);
      console.log(ethereumNFT.total);
      var ethereumnftList = [];
      for (j = 0; j < ethereumNFT.total; j++) {
        console.log(ethereumNFT.result[j]);
        ethereumnftList.push(ethereumNFT.result[j]);
      }
    }
    setNFTList(ethereumnftList);
    console.log(nftList);
    setNetwork(1);
    setLoading(false);
  };

  const getUserPolygonNFT = async (count, addressArray) => {
    setLoading(true);
    var i = 0;
    var j = 0;
    var k = 0;
    var l = 0;

    var polygonnftList = [];
    var polygonNominatedList = [];
    var polygonInheritList = [];

    for (i = 0; i < count; i++) {
      console.log(addressArray[i]);
      const polygonNFT = await getNFTBalances({
        params: { chain: "mumbai", address: addressArray[i] },
      });
      console.log(polygonNFT);
      console.log(polygonNFT.total);

      await Moralis.enableWeb3();
      const web3 = new Web3(Moralis.provider);

      const saturn = new web3.eth.Contract(saturnABI, contractAddressPolygon);
      console.log(saturn);

      const nominationCount = await saturn.methods.nominationIds().call();

      for (j = 0; j < polygonNFT.total; j++) {
        console.log(polygonNFT.result[j]);
        polygonnftList.push(polygonNFT.result[j]);
      }

      for (k = 1; k <= nominationCount; k++) {
        const nomination = await saturn.methods.nominations(k).call();
        console.log(nomination);
        console.log("HMMM" + addressArray[i]);
        // if(nomination).nominatedBy == addressArray[i]
        if (
          nomination.nominatedBy.toUpperCase() == addressArray[i].toUpperCase()
        ) {
          polygonNominatedList.push(nomination);
        }
      }
      console.log(polygonNominatedList);

      for (l = 1; l <= nominationCount; l++) {
        const nomination = await saturn.methods.nominations(l).call();
        console.log(nomination);
        // if(nomination).nominatedBy == addressArray[i]
        console.log(addressArray[i]);
        if (nomination.nominee.toUpperCase() == addressArray[i].toUpperCase()) {
          polygonInheritList.push(nomination);
          console.log(addressArray[i]);
        }
      }
      console.log(polygonInheritList);
    }

    setNFTList(polygonnftList);
    setInheritList(polygonInheritList);
    setNominatedList(polygonNominatedList);
    console.log(nftList);
    console.log(nominatedList);
    console.log(inheritList);
    setNetwork(2);
    setLoading(false);
  };

  const getUserBSCNFT = async (count, addressArray) => {
    setLoading(true);
    var i = 0;
    var j = 0;
    setNFTList([]);
    setInheritList([]);
    setNominatedList([]);
    for (i = 0; i < count; i++) {
      console.log(addressArray[i]);
      const bscNFTS = await getNFTBalances({
        params: { chain: "bsc testnet", address: addressArray[i] },
      });
      console.log(bscNFTS);
      console.log(bscNFTS.total);
      var bscnftList = [];
      for (j = 0; j < bscNFTS.total; j++) {
        console.log(bscNFTS.result[j]);
        bscnftList.push(bscNFTS.result[j]);
      }
    }
    setNFTList(bscnftList);
    console.log(bscnftList);
    setNetwork(3);
    setLoading(false);
  };

  const getUserAvalancheNFT = async (count, addressArray) => {
    setLoading(true);
    setNFTList([]);
    setInheritList([]);
    setNominatedList([]);
    var i = 0;
    var j = 0;
    var k = 0;
    var l = 0;

    var avalanchenftList = [];
    var avalancheNominatedList = [];
    var avalancheInheritList = [];

    for (i = 0; i < count; i++) {
      console.log(addressArray[i]);
      const avalancheNFT = await getNFTBalances({
        params: { chain: "avalanche testnet", address: addressArray[i] },
      });
      console.log(avalancheNFT);
      console.log(avalancheNFT.total);
      var avalanchenftList = [];
      await Moralis.enableWeb3();
      const web3 = new Web3(Moralis.provider);

      const saturn = new web3.eth.Contract(saturnABI, contractAddressAvalanche);
      console.log(saturn);

      const nominationCount = await saturn.methods.nominationIds().call();

      for (j = 0; j < avalancheNFT.total; j++) {
        console.log(avalancheNFT.result[j]);
        avalanchenftList.push(avalancheNFT.result[j]);
      }

      for (k = 1; k <= nominationCount; k++) {
        const nomination = await saturn.methods.nominations(k).call();
        console.log(nomination);
        console.log("HMMM" + addressArray[i]);
        // if(nomination).nominatedBy == addressArray[i]
        if (
          nomination.nominatedBy.toUpperCase() == addressArray[i].toUpperCase()
        ) {
          avalancheNominatedList.push(nomination);
        }
      }
      console.log(avalancheNominatedList);

      for (l = 1; l <= nominationCount; l++) {
        const nomination = await saturn.methods.nominations(l).call();
        console.log(nomination);
        // if(nomination).nominatedBy == addressArray[i]
        console.log(addressArray[i]);
        if (nomination.nominee.toUpperCase() == addressArray[i].toUpperCase()) {
          avalancheInheritList.push(nomination);
          console.log(addressArray[i]);
        }
      }
      console.log(avalancheInheritList);
    }
    setNFTList(avalanchenftList);
    setInheritList(avalancheInheritList);
    setNominatedList(avalancheNominatedList);
    console.log(nftList);
    console.log(nominatedList);
    console.log(inheritList);
    setNetwork(4);
    setLoading(false);
  };

  const approveNFT = async (tokenAddress, tokenId, owner) => {
    setLoading(true);
    console.log(tokenAddress);
    console.log(tokenId);
    console.log(nomineeAddress);
    const x = await Moralis.enableWeb3();
    const web3 = new Web3(Moralis.provider);
    const nft = new web3.eth.Contract(tokenABI, tokenAddress);
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    setAccount(accounts[0]);
    console.log(nft);
    console.log(userAddress);
    console.log(owner);

    var saturnAddress;
    console.log(network);
    if (network == 1) {
      saturnAddress = contractAddressEthereum;
    } else if (network == 2) {
      saturnAddress = contractAddressPolygon;
    } else if (network == 3) {
      saturnAddress = contractAddressBSC;
    } else if (network == 4) {
      saturnAddress = contractAddressAvalanche;
    } else {
      alert("Gadbad");
    }

    console.log(saturnAddress);

    nft.methods
      .setApprovalForAll(saturnAddress, true)
      .send({ from: owner })
      .on("transactionHash", (hash) => {
        console.log(hash);

        setLoading(false);
      });
  };


  const addNominee = async (tokenAddress, tokenId) => {
    setLoading(true);

    console.log(tokenAddress);
    console.log(tokenId);
    console.log(nomineeAddress);
    await Moralis.enableWeb3();
    const web3 = new Web3(Moralis.provider);

    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    setAccount(accounts[0]);

    var saturn;
    if (network == 1) {
      saturn = new web3.eth.Contract(saturnABI, contractAddressEthereum);
      console.log(saturn);
    } else if (network == 2) {
      saturn = new web3.eth.Contract(saturnABI, contractAddressPolygon);
      console.log(saturn);
    } else if (network == 3) {
      saturn = new web3.eth.Contract(saturnABI, contractAddressBSC);
      console.log(saturn);
    } else if (network == 4) {
      saturn = new web3.eth.Contract(saturnABI, contractAddressAvalanche);
      console.log(saturn);
    } else {
      alert("Gadbad");
    }

    console.log(nomineeAddress);
    saturn.methods
      .Nominate(tokenAddress, tokenId, nomineeAddress)
      .send({ from: accounts[0] })
      .on("transactionHash", (hash) => {
        console.log(hash);

        setLoading(false);
      });

    setLoading(false);
  };

  const initiateFetchRequest = async (nominationID) => {
    setLoading(true);
    console.log(nominationID);

    await Moralis.enableWeb3();
    const web3 = new Web3(Moralis.provider);

    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    setAccount(accounts[0]);

    var saturn;
    if (network == 1) {
      saturn = new web3.eth.Contract(saturnABI, contractAddressEthereum);
      console.log(saturn);
    } else if (network == 2) {
      saturn = new web3.eth.Contract(saturnABI, contractAddressPolygon);
      console.log(saturn);
    } else if (network == 3) {
      saturn = new web3.eth.Contract(saturnABI, contractAddressBSC);
      console.log(saturn);
    } else if (network == 4) {
      saturn = new web3.eth.Contract(saturnABI, contractAddressAvalanche);
      console.log(saturn);
    } else {
      alert("Gadbad");
    }

    var param = {
      to:"kalerv@rknec.edu"
    }

    saturn.methods
      .initiateFetchRequest(nominationID)
      .send({ from: accounts[0] })
      .on("transactionHash", (hash) => {
        console.log(hash);
        emailjs
        .send("service_f9b4wm9", "template_ex0sd98", param, "eZXFYd0dvz7-pRCn3")
        .then(
          (result) => {
            alert("Fetch Request Initiated", result.text);
          },
          (error) => {
            alert("An error occurred, Please try again", error.text);
          }
        );
      });
    setLoading(false);
  };

  const rejectFetchRequest = async (nominationID) => {
    setLoading(true);
    console.log(nominationID);

    await Moralis.enableWeb3();
    const web3 = new Web3(Moralis.provider);

    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    setAccount(accounts[0]);

    var saturn;
    if (network == 1) {
      saturn = new web3.eth.Contract(saturnABI, contractAddressEthereum);
      console.log(saturn);
    } else if (network == 2) {
      saturn = new web3.eth.Contract(saturnABI, contractAddressPolygon);
      console.log(saturn);
    } else if (network == 3) {
      saturn = new web3.eth.Contract(saturnABI, contractAddressBSC);
      console.log(saturn);
    } else if (network == 4) {
      saturn = new web3.eth.Contract(saturnABI, contractAddressAvalanche);
      console.log(saturn);
    } else {
      alert("Gadbad");
    }

    saturn.methods
      .rejectFetchRequest(nominationID)
      .send({ from: accounts[0] })
      .on("transactionHash", (hash) => {
        console.log(hash);
      });
    setLoading(false);
  };

  const executeTransfer = async (nominationID) => {
    setLoading(true);
    console.log(nominationID);

    await Moralis.enableWeb3();
    const web3 = new Web3(Moralis.provider);

    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    setAccount(accounts[0]);

    var saturn;
    if (network == 1) {
      saturn = new web3.eth.Contract(saturnABI, contractAddressEthereum);
      console.log(saturn);
    } else if (network == 2) {
      saturn = new web3.eth.Contract(saturnABI, contractAddressPolygon);
      console.log(saturn);
    } else if (network == 3) {
      saturn = new web3.eth.Contract(saturnABI, contractAddressBSC);
      console.log(saturn);
    } else if (network == 4) {
      saturn = new web3.eth.Contract(saturnABI, contractAddressAvalanche);
      console.log(saturn);
    } else {
      alert("Gadbad");
    }

    saturn.methods
      .executeTransfer(nominationID)
      .send({ from: accounts[0] })
      .on("transactionHash", (hash) => {
        console.log(hash);
      });
    setLoading(false);
  };

  const divStyle = {
    width: "100%",
    height: "826px",
    backgroundImage: `url(https://i.pinimg.com/originals/cc/b0/1c/ccb01c058068c3e2a09c9fb751299297.gif)`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  if (!isAuthenticated) {
    return <Login />;
  } else if (loading) {
    return (
      <div style={divStyle}>
        {/* <img
        
          // style={{ marginLeft: "25%", marginTop: "8%" }}
          //src="https://www.faiver.io/static/media/loader.58607b10.gif"
        /> */}
      </div>
    );
  } else {
    return (
      <>
        {/* IF USER IS LOGGED IN THEN THIS PAGE ELSE LOGIN PAGE */}
        <LogoutNav />
        <main className="profile-page" useref="main">
          <section className="section-profile-cover section-shaped my-0">
            {/* Circles background */}
            <div className="shape shape-style-1 shape-default alpha-4"></div>
            {/* SVG separator */}
            <div className="separator separator-bottom separator-skew">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-white"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </section>
          <section className="section">
            <Container>
              <Card className="card-profile shadow mt--300">
                <div className="px-4">
                  <Row className="justify-content-center">
                    <Col className="order-lg-2" lg="3">
                      <div className="card-profile-image">
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          <img
                            alt="..."
                            className="rounded-circle"
                            src={require("assets/img/theme/profilePic.webp")}
                          />
                        </a>
                      </div>
                    </Col>
                    <Col
                      className="order-lg-3 text-lg-right align-self-lg-center"
                      lg="4"
                    >
                      <div className="card-profile-actions py-4 mt-lg-0">
                        <Button
                          className="mr-4"
                          color="info"
                          onClick={connectWallet}
                          size="sm"
                        >
                          Add Account
                        </Button>
                        <UncontrolledDropdown size="sm">
                          <DropdownToggle caret color="secondary">
                            Select Chain
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              href="#pablo"
                              onClick={() =>
                                getUserEthereumNFT(1, user.get("accounts"))
                              }
                            >
                              Ethereum
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={() =>
                                getUserPolygonNFT(
                                  user.get("accounts").length,
                                  user.get("accounts")
                                )
                              }
                            >
                              Polygon
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={() =>
                                getUserAvalancheNFT(
                                  user.get("accounts").length,
                                  user.get("accounts")
                                )
                              }
                            >
                              Avalanche
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={() =>
                                getUserBSCNFT(1, user.get("accounts"))
                              }
                            >
                              BSC
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </Col>
                    <Col className="order-lg-1" lg="4">
                      <div className="card-profile-stats d-flex justify-content-center">
                        <div>
                          <span className="heading">{nftList.length}</span>
                          <span className="description">NFTs</span>
                        </div>
                        <div>
                          <span className="heading">
                            {nominatedList.length}
                          </span>
                          <span className="description">Nomination</span>
                        </div>
                        <div>
                          <span className="heading">{inheritList.length}</span>
                          <span className="description">To Inherit</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  {/* <div className="text-center mt-5">
                    {/* {userError && <p>{userError.message}</p>}
                    <pre>{JSON.stringify(user)}</pre>
                    {user && console.log(user.get("username"))} 
                  </div> */}

                  <div className="card-profile-stats d-flex justify-content-center">
                    <div>
                      <span className="heading">
                        {user && user.get("username")}
                      </span>
                    </div>
                  </div>

                  <Col lg="14">
                    <div className="nav-wrapper">
                      <Nav
                        className="nav-fill flex-column flex-md-row"
                        id="tabs-icons-text"
                        pills
                        role="tablist"
                      >
                        <NavItem>
                          <NavLink
                            aria-selected={state === 1}
                            className={classnames("mb-sm-3 mb-md-0", {
                              active: state === 1,
                            })}
                            onClick={(e) => toggleNavs(e, "iconTabs", 1)}
                            href="#pablo"
                            role="tab"
                          >
                            <i className="ni ni-cloud-upload-96 mr-2" />
                            NFT
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            aria-selected={state === 2}
                            className={classnames("mb-sm-3 mb-md-0", {
                              active: state === 2,
                            })}
                            onClick={(e) => toggleNavs(e, "iconTabs", 2)}
                            href="#pablo"
                            role="tab"
                          >
                            <i className="ni ni-bell-55 mr-2" />
                            Nominations
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            aria-selected={state === 3}
                            className={classnames("mb-sm-3 mb-md-0", {
                              active: state === 3,
                            })}
                            onClick={(e) => toggleNavs(e, "iconTabs", 3)}
                            href="#pablo"
                            role="tab"
                          >
                            <i className="ni ni-calendar-grid-58 mr-2" />
                            To Inherit
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>

                    <TabContent activeTab={"iconTabs" + state}>
                      <TabPane tabId="iconTabs1">
                        <div className="mt-1 py-4 text-center">
                          <Row className="justify-content-center">
                            <Col lg="9">
                              {nftList.length > 0 && (
                                <section>
                                  <Container>
                                    <Row className="justify-content-center">
                                      <Col lg="12">
                                        <Row className="row-grid">
                                          {nftList.map((e, key) => (
                                            <Col lg="6">
                                              <br />
                                              <br />
                                              <Card
                                                className="card-lift--hover shadow border-0"
                                                key={key}
                                                onClick={console.log(
                                                  nftList[key].owner_of
                                                )}
                                              >
                                                <CardImg
                                                  alt="..."
                                                  
                                                  src={`${nftList[key].token_uri}`}
                                                  top
                                                  
                                                />

                                                <CardBody>
                                                  <h6>Contract Address</h6>
                                                  <a>
                                                    {nftList[key].token_address}
                                                  </a>
                                                  <h6>Name</h6>{" "}
                                                  <a>{nftList[key].name}</a>
                                                  <h6>Owner</h6>{" "}
                                                  <a>{nftList[key].owner_of}</a>
                                                </CardBody>
                                                {/* Form Modal */}

                                                <Button
                                                  block
                                                  color="default"
                                                  type="button"
                                                  className="mr-4"
                                                  onClick={toggleModal}
                                              
                                                >
                                                  Assign Nominee
                                                </Button>
                                                <Modal
                                                  className="modal-dialog-centered"
                                                  size="sm"
                                                  isOpen={modal}
                                                  toggle={toggleModal}
                                                  key={key}
                                                >
                                                  <div className="modal-body p-0">
                                                    <Card className="bg-secondary shadow border-0">
                                                      <CardBody className="px-lg-5 py-lg-5">
                                                        <div className="text-center text-muted mb-4">
                                                          <small>
                                                            Set the Nominee
                                                          </small>
                                                        </div>
                                                        <Form role="form">
                                                          <FormGroup
                                                            className={classnames(
                                                              "mb-3"
                                                            )}
                                                          >
                                                            <InputGroup className="input-group-alternative">
                                                              <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>
                                                                  <i className="ni ni-text-83" />
                                                                </InputGroupText>
                                                              </InputGroupAddon>
                                                              <Input
                                                                placeholder="Nominee Address"
                                                                type="text"
                                                                value={
                                                                  nomineeAddress
                                                                }
                                                                onChange={(e) =>
                                                                  setNomineeAddress(
                                                                    e.target
                                                                      .value
                                                                  )
                                                                }
                                                              />
                                                            </InputGroup>
                                                          </FormGroup>
                                                          <div className="text-center">
                                                            <Button
                                                              className="my-4"
                                                              color="primary"
                                                              type="button"
                                                              onClick={() => {
                                                                console.log(
                                                                  nftList[key]
                                                                    .owner_of
                                                                );
                                                                console.log(e)
                                                                approveNFT(
                                                                  nftList[key]
                                                                    .token_address,
                                                                  nftList[key]
                                                                    .token_id,
                                                                  nftList[key]
                                                                    .owner_of
                                                                );
                                                              }}
                                                            >
                                                              Approve NFT
                                                            </Button>
                                                            <Button
                                                              className="my-4"
                                                              color="primary"
                                                              type="button"
                                                              onClick={() =>
                                                                addNominee(
                                                                  nftList[key]
                                                                    .token_address,
                                                                  nftList[key]
                                                                    .token_id
                                                                )
                                                              }
                                                            >
                                                              Add Nominee
                                                            </Button>
                                                          </div>
                                                        </Form>
                                                      </CardBody>
                                                    </Card>
                                                  </div>
                                                </Modal>
                                              </Card>
                                            </Col>
                                          ))}
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Container>
                                </section>
                              )}
                            </Col>
                          </Row>
                        </div>
                      </TabPane>
                      <TabPane tabId="iconTabs2">
                        <div className="mt-1 py-4 text-center">
                          <Row className="justify-content-center">
                            <Col lg="9">
                              {nominatedList.length > 0 && (
                                <section>
                                  <Container>
                                    <Row className="justify-content-center">
                                      <Col lg="12">
                                        <Row className="row-grid">
                                          {nominatedList.map((e, key) => (
                                            <Col lg="6">
                                              <br />
                                              <br />
                                              <Card
                                                className="card-lift--hover shadow border-0"
                                                onClick={console.log(
                                                  nominatedList[key]
                                                )}
                                              >
                                                <CardImg
                                                  alt="..."
                                                  src={`https://bafybeibsnz222dyn7m4zz6ytzhpxdul45s2ndj7fn2q5onxxrrnj7d32oi.ipfs.nftstorage.link/`}
                                                  top
                                                />

                                                <CardBody>
                                                  <h6>Nominee Address</h6>
                                                  <a>
                                                    {nominatedList[key].nominee}
                                                  </a>
                                                  <h6>Owner Address</h6>
                                                  <a>
                                                    {
                                                      nominatedList[key]
                                                        .nominatedBy
                                                    }
                                                  </a>

                                                  <h6>Fetch Status</h6>
                                                  <a>
                                                    {nominatedList[
                                                      key
                                                    ].fetchRequestInitiated
                                                      .toString()
                                                      .toUpperCase()}
                                                  </a>
                                                </CardBody>

                                                {nominatedList[key]
                                                  .fetchRequestInitiated && (
                                                  <Button
                                                    block
                                                    color="default"
                                                    type="button"
                                                    className="mr-4"
                                                    onClick={() =>
                                                      rejectFetchRequest(
                                                        inheritList[key]
                                                          .nominationId
                                                      )
                                                    }
                                                  >
                                                    Reject Fetch Request
                                                  </Button>
                                                )}
                                              </Card>
                                            </Col>
                                          ))}
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Container>
                                </section>
                              )}
                            </Col>
                          </Row>
                        </div>
                      </TabPane>
                      <TabPane tabId="iconTabs3">
                        <div className="mt-1 py-4 text-center">
                          <Row className="justify-content-center">
                            <Col lg="9">
                              {inheritList.length > 0 && (
                                <section>
                                  <Container>
                                    <Row className="justify-content-center">
                                      <Col lg="12">
                                        <Row className="row-grid">
                                          {inheritList.map((e, key) => (
                                            <Col lg="6">
                                              <br />
                                              <br />
                                              <Card
                                                className="card-lift--hover shadow border-0"
                                                onClick={console.log(
                                                  inheritList[key].tokenAddress
                                                )}
                                              >
                                                <CardImg
                                                  alt="..."
                                                  src={`https://bafybeibsnz222dyn7m4zz6ytzhpxdul45s2ndj7fn2q5onxxrrnj7d32oi.ipfs.nftstorage.link/`}
                                                  top
                                                />

                                                <CardBody>
                                                  <h6>Nominee Address</h6>
                                                  <a>
                                                    {inheritList[key].nominee}
                                                  </a>
                                                  <h6>Fetch Status</h6>{" "}
                                                  <a>
                                                    {inheritList[
                                                      key
                                                    ].fetchRequestInitiated
                                                      .toString()
                                                      .toUpperCase()}
                                                  </a>
                                                </CardBody>
                                                {!inheritList[key]
                                                  .fetchRequestInitiated && (
                                                  <Button
                                                    block
                                                    color="default"
                                                    type="button"
                                                    className="mr-4"
                                                    onClick={() =>
                                                      initiateFetchRequest(
                                                        inheritList[key]
                                                          .nominationId
                                                      )
                                                    }
                                                  >
                                                    Init Fetch Request
                                                  </Button>
                                                )}

                                                {inheritList[key]
                                                  .fetchRequestInitiated && (
                                                  <Button
                                                    block
                                                    color="default"
                                                    type="button"
                                                    className="mr-4"
                                                    onClick={() =>
                                                      executeTransfer(
                                                        inheritList[key]
                                                          .nominationId
                                                      )
                                                    }
                                                  >
                                                    Claim NFT
                                                  </Button>
                                                )}
                                              </Card>
                                            </Col>
                                          ))}
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Container>
                                </section>
                              )}
                            </Col>
                          </Row>
                        </div>
                      </TabPane>
                    </TabContent>
                  </Col>
                </div>
              </Card>
            </Container>
          </section>
        </main>
        <SimpleFooter />
      </>
    );
  }
}

export default Profile;

// 0xF9053A15f04C3D56404Ee57da87722cF27ECaDc7
// 0x04424d3A13fbe530A423E4Cf7B75A75240d72263
