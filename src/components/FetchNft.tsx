import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { FC, useEffect, useState } from "react";
import styles from "../styles/custom.module.css";

export const FetchNft: FC = () => {
  const [nftData, setNftData] = useState(null);

  const { connection } = useConnection();
  const wallet = useWallet();
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

  const fetchNfts = async () => {
    if (!wallet.connected) {
      return;
    }

    // fetch NFTs for connected wallet
    const nfts = await metaplex
      .nfts()
      .findAllByOwner({ owner: wallet.publicKey });

    // Fetch off chain metadata for each NFT
    let nftData = [];
    for (let i = 0; i < nfts.getResult.length; i++) {
      let fetchResult = await fetch(nfts[i].uri);
      let json = await fetchResult.json();
      console.log("NFT METADATA:", json);
      nftData.push(json);
    }

    setNftData(nftData);
  };

  useEffect(() => {
    fetchNfts();
  }, [wallet]);

  return (
    <div>
      {nftData && (
        <div className={styles.gridNft}>
          {nftData.map((nft) => (
            <div>
              <ul>{nft.name}</ul>
              <img src={nft.image} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};