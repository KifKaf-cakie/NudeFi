import React, { useState } from 'react';

// モックデータを定義
const mockProfileData = {
  displayName: "Creative Creator",
  handle: "creativecreator",
  avatar: "https://via.placeholder.com/150",
  bio: "Passionate about creating unique digital experiences"
};

const mockCoinBalances = [
  { 
    token: { 
      symbol: "ART", 
      name: "Art Token" 
    }, 
    amount: { amountDecimal: 150.75 },
    valueUsd: "4500.25"
  },
  { 
    token: { 
      symbol: "MUSIC", 
      name: "Music Money" 
    }, 
    amount: { amountDecimal: 75.50 },
    valueUsd: "2250.75"
  },
  { 
    token: { 
      symbol: "VIDEO", 
      name: "Video Vision" 
    }, 
    amount: { amountDecimal: 50.25 },
    valueUsd: "1507.50"
  }
];

const DashboardPage = () => {
  const [profileData] = useState(mockProfileData);
  const [coinBalances] = useState(mockCoinBalances);

  // 総資産価値を計算
  const totalValue = coinBalances.reduce((sum, balance) => {
    return sum + parseFloat(balance.valueUsd);
  }, 0);

  // カラーパレット
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // パイチャート用のデータを準備
  const pieData = coinBalances.map(balance => ({
    name: balance.token.symbol,
    value: parseFloat(balance.valueUsd)
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* プロフィールセクション */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <img 
            src={profileData.avatar} 
            alt="Profile" 
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h2 className="text-xl font-semibold">
              {profileData.displayName}
            </h2>
            <p className="text-gray-500">
              @{profileData.handle}
            </p>
          </div>
        </div>
      </div>

      {/* ポートフォリオ概要 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ポートフォリオ価値 */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Portfolio Value</h3>
          <div className="text-2xl font-bold text-green-600">
            ${totalValue.toLocaleString()}
          </div>
        </div>

        {/* コイン保有状況 */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Coin Holdings</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Coin</th>
                  <th className="text-right py-2">Balance</th>
                  <th className="text-right py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {coinBalances.map((balance, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{balance.token.symbol}</td>
                    <td className="text-right py-2">
                      {balance.amount.amountDecimal.toFixed(2)}
                    </td>
                    <td className="text-right py-2">
                      ${balance.valueUsd}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;