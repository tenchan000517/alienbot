// src/utils/wallet.js
export const getWallet = () => {
    return localStorage.getItem('wallet');
  };
  
  export const setWallet = (address) => {
    localStorage.setItem('wallet', address);
  };