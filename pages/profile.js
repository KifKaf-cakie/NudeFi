import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Edit as EditIcon, 
  Copy as CopyIcon, 
  Link as LinkIcon 
} from 'lucide-react';

// モックデータ
const mockProfileData = {
  displayName: "Creative Creator",
  handle: "creativecreator",
  avatar: "https://via.placeholder.com/150",
  bio: "Passionate about creating unique digital experiences and exploring the world of blockchain art.",
  followers: 1234,
  following: 567,
  linkedWallets: [
    { walletType: "Ethereum", walletAddress: "0x1234...5678" },
    { walletType: "Base", walletAddress: "0x8765...4321" }
  ]
};

const mockComments = [
  {
    author: {
      handle: "artfan",
      avatar: "https://via.placeholder.com/50",
      address: "0x9876...5432"
    },
    text: "Amazing work! Love the creativity in this piece.",
    createdAt: "2 hours ago",
    reactions: [
      { type: 'like', count: 15 },
      { type: 'comment', count: 3 }
    ]
  }
];

const ProfilePage = () => {
  const [profileData] = useState(mockProfileData);
  const [comments] = useState(mockComments);
  const [activeTab, setActiveTab] = useState('about');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileData.handle);
    alert('Handle copied to clipboard!');
  };

  const renderAboutSection = () => (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* 省略 */}
    </div>
  );

  const renderCommentsSection = () => (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* 省略 */}
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      {/* プロファイルヘッダー */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={profileData.avatar} 
              alt="Profile" 
              className="w-24 h-24 rounded-full mr-6"
            />
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold mr-2">{profileData.displayName}</h1>
                <button onClick={copyToClipboard} className="text-gray-500 hover:text-gray-700">
                  <CopyIcon size={16} />
                </button>
              </div>
              <p className="text-gray-500">@{profileData.handle}</p>
            </div>
          </div>
          <div>
            <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              <EditIcon size={16} className="mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* タブ */}
      <div className="flex mb-6 border-b">
        <button 
          className={`px-4 py-2 ${activeTab === 'about' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'comments' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('comments')}
        >
          Comments
        </button>
      </div>

      {/* コンテンツ */}
      {activeTab === 'about' ? renderAboutSection() : renderCommentsSection()}
    </div>
  );
};

export default ProfilePage;