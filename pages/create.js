import { useState } from 'react';
import Head from 'next/head';
import { useAccount } from 'wagmi';
import { uploadToIPFS, uploadMetadataToIPFS } from '../utils/ipfsUtils';
import { createCreatorCoin } from '../services/zoraService';

export default function CreatePage() {
  const { address, isConnected } = useAccount();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !name || !symbol || !description || !isConnected) {
      alert('全ての項目を入力してください。');
      return;
    }

    try {
      setStatus('IPFSへアップロード中...');
      const content = await uploadToIPFS(file);
      const metadataCID = await uploadMetadataToIPFS({
        name,
        symbol,
        description,
        image: `ipfs://${content.cid}`,
      });

      setStatus('Zora Coinsでコイン作成中...');
      const result = await createCreatorCoin(
        {
          name,
          symbol,
          uri: `ipfs://${metadataCID}`,
        },
        address
      );

      setStatus(`作成成功！コインアドレス: ${result.coinAddress}`);
    } catch (err) {
      console.error(err);
      setStatus('作成に失敗しました。コンソールを確認してください。');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-20">
      <Head>
        <title>Create | NudeFi</title>
      </Head>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-pink-500">Create Content & Coin</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Coin Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-800 rounded-lg px-4 py-2"
            required
          />
          <input
            type="text"
            placeholder="Coin Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full bg-gray-800 rounded-lg px-4 py-2"
            required
          />
          <textarea
            placeholder="Content Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-800 rounded-lg px-4 py-2"
            rows={4}
            required
          />
          <input
            type="file"
            accept="image/*,video/*,audio/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full"
            required
          />
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Mint
          </button>
        </form>
        {status && <p className="mt-4 text-sm text-yellow-400">{status}</p>}
      </div>
    </div>
  );
}
