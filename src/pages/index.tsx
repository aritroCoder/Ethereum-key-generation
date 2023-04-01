import Head from 'next/head'
import { useState } from 'react'
import elliptic from 'elliptic'
import { keccak256 } from 'js-sha3';
import styles from '../styles/Home.module.css'
import Image from 'next/image';

export default function Home() {
  const [key, setKey] = useState('Not generated');
  const [publicKey, setPublicKey] = useState('Not generated');
  const [address, setAddress] = useState('Not generated');
  const [message, setMessage] = useState('');
  const [messageHash, setMessageHash] = useState('');
  const [signedMsg, setSignedMsg] = useState<{r: String, s: String}>({r: '', s: ''});
  const [verification, setVerification] = useState(false);
  const ec = new elliptic.ec('secp256k1');
  
  function binToHex(bin: String) {
    var hex = '';
    for (var i = 0; i < bin.length; i += 4) {
      hex += parseInt(bin.substr(i, 4), 2).toString(16);
    }
    return hex;
  }

  function secp256k1(x: number) {
    return Math.sqrt(Math.pow(x, 3) + 7);
  }

  function getPrivateKey(){
    const array = new Uint32Array(256);
    crypto.getRandomValues(array);
    for (let i = 0; i < array.length; i++) {
      array[i] = array[i] % 2; // generate binary array`
    }
    const privateKey = array.join('');
    const hexPrivateKey = binToHex(privateKey);
    setKey(hexPrivateKey);
  }

  function getPublicKey(pvtKey: String){
    if(pvtKey.length !== 64) return alert('Invalid private key');
    var publicKey = ec.keyFromPrivate(pvtKey).getPublic('hex', true);
    setPublicKey(publicKey);
    // Convert the public key to a Buffer
    const publicKeyBuffer = Buffer.from(publicKey, 'hex');
    // Hash the public key using Keccak-256
    const hashedPublicKey = keccak256(publicKeyBuffer);
    setAddress('0x'+hashedPublicKey.substring(hashedPublicKey.length - 40)); // get the last 40 chars for address
  }

  function signHash(){
    if(key.length !== 64) return alert('Invalid private key');
    if(message.length === 0) return alert('Message is empty');
    const hash = keccak256(message);
    setMessageHash(hash);
    const signedHash = ec.keyFromPrivate(key).sign(hash);
    setSignedMsg(signedHash);
    console.log(signedHash);
  }

  function verify(){
    if(publicKey.length !== 130) return alert('Invalid public key');
    if(message.length === 0) return alert('Message is empty');
    if(messageHash.length === 0) return alert('Message hash is empty');
    if(signedMsg.r.length === 0 || signedMsg.s.length === 0) return alert('Message is not signed');
    const verify = ec.keyFromPublic(publicKey, 'hex').verify(messageHash, signedMsg);
    setVerification(verify);
  }

  return (
    <>
      <Head>
        <title>Eth key generation</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{overflowX: 'hidden', padding: '0 25%'}}>
        <h1>Ethereum key generation</h1>
        <div className={styles.privateKey}>
          <button onClick={getPrivateKey}>Generate private key</button>
          <p><span style={{fontWeight: 'bold'}}>Private Key:</span> {key}</p>
        </div>
        <div style={{textAlign: 'center'}}><Image src="https://codeahoy.com/learn/practicalcryptography/img/assets/bitcoin-elliptic-curve.png" alt="Elliptic curve" width={300} height={300} /></div>
        <p style={{textAlign: 'center'}}>Elliptic curve: y^2 = x^3 + 7 (secp256k1 curve)</p>
        <div className={styles.publicKey}>
          <button onClick={() => getPublicKey(key)}>Generate public key</button>
          <p><span style={{fontWeight: 'bold'}}>Public Key:</span> {publicKey}</p>
        </div>
        <div className={styles.address}>
          <p><span style={{fontWeight: 'bold'}}>Address:</span> {address}</p>
        </div>
        <div className={styles.message}>
          <p><span style={{fontWeight: 'bold'}}>Message:</span></p>
          <input type="textarea" onChange={(e) => setMessage(e.target.value)} value={message}/>
          <button onClick={() => setMessage('')}>Clear</button>
          <button onClick={() => signHash()}>Sign and hash</button>
          {signedMsg.r && <p>
            <span style={{fontWeight: 'bold'}}>Signed message:</span><br/>
            r = {signedMsg.r.toString()}<br/>
            s = {signedMsg.s.toString()}
          </p>}
        </div>
        Hashing algorithm: Keccak-256
        <div className={styles.verify}>
          <button onClick={() => verify()}>Verify</button>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <p><span style={{fontWeight: 'bold'}}>Message hash:</span> {messageHash}</p>
            <p><span style={{fontWeight: 'bold'}}>Public key:</span> {publicKey}</p>
            <p><span style={{fontWeight: 'bold'}}>Signed message:</span><br/>
              r = {signedMsg.r.toString()}<br/>
              s = {signedMsg.s.toString()}
            </p>
            <p>Verification result: {verification? "Verified" : <span style={{backgroundColor: "red", padding: 5}}>Not Verified</span>}</p>
            </div>
        </div>
      </main>
      <footer className={styles.footer}>
        Made with ❤️  by <a href="https://www.github.com/aritroCoder">aritroCoder</a>
      </footer>
    </>
  )
}
