import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
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
      alert('Please fill in all fields.');
      return;
    }

    try {
      setStatus('Uploading to IPFS...');
      const content = await uploadToIPFS(file);

      setStatus('Creating coin with Zora...');
      const metadataCID = await uploadMetadataToIPFS({
        name,
        symbol,
        description,
        image: `ipfs://${content.cid}`,
      });

      const result = await createCreatorCoin(
        {
          name,
          symbol,
          uri: `ipfs://${metadataCID}`,
        },
        address
      );

      setStatus(`Coin created successfully! Coin address: ${result.coinAddress}`);
    } catch (err) {
      console.error(err);
      setStatus('Creation failed! Please check the console.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-20">
      <Head>
        <title>Create | NudeFi</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        {/* Page Header with Back to Home */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-pink-500">Create Content & Coin</h1>
          <Link href="/" className="text-pink-400 hover:text-pink-300 underline">
            ← Back to Home
          </Link>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6 shadow-md border border-pink-500/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-gray-300 font-semibold">Coin Name</label>
              <input
                type="text"
                placeholder="Coin Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300 font-semibold">Coin Symbol</label>
              <input
                type="text"
                placeholder="Coin Symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300 font-semibold">Content Description</label>
              <textarea
                placeholder="Describe your content here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300 font-semibold">Upload File</label>
              <input
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-gray-200"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Mint
              </button>
            </div>
          </form>

          {status && <p className="mt-4 text-sm text-yellow-400">{status}</p>}
        </div>
      </div>
    </div>
  );
}
