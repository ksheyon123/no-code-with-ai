import md5 from "crypto-js/md5";

const createRandomHash = () => {
  const rndNumber = Math.floor(Math.random() * 100000000000).toString();
  return md5(rndNumber).toString();
};

export { createRandomHash };
