import md5 from "crypto-js/md5";

const createRandomHash = () => {
  return md5("Message").toString();
};

export { createRandomHash };
