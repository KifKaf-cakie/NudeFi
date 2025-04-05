import React, { useState } from "react";
import {
  Heart,
  Eye,
  Lock,
  Bookmark,
  Sparkles,
  Star,
  Filter,
} from "lucide-react";

export default function ContentBrowser() {
  const [activeTab, setActiveTab] = useState("trending");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedContentType, setSelectedContentType] = useState("all");

  const contentItems = [
    {
      id: 1,
      title: "Sample Content",
      creator: "CreatorName",
      creatorAvatar: "",
      coinSymbol: "COIN",
      contentType: "image",
      category: "lingerie",
      image: "https://via.placeholder.com/400x300",
      isSubscription: true,
      price: "0.05",
      mintCount: 120,
      likes: 99,
      isNew: true,
    },
  ];

  const filteredContent = contentItems.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory)
      return false;
    if (
      selectedContentType !== "all" &&
      item.contentType !== selectedContentType
    )
      return false;
    return true;
  });

  const sortedContent = [...filteredContent].sort((a, b) => {
    if (activeTab === "trending") return b.mintCount - a.mintCount;
    if (activeTab === "newest") return b.isNew ? 1 : -1;
    if (activeTab === "popular") return b.likes - a.likes;
    return 0;
  });

  return (
    <div>
      <div className="tabs">
        <button onClick={() => setActiveTab("trending")}>Trending</button>
        <button onClick={() => setActiveTab("newest")}>Newest</button>
        <button onClick={() => setActiveTab("popular")}>Popular</button>
      </div>

      <button onClick={() => setFilterOpen(!filterOpen)}>
        <Filter /> Filters
      </button>

      {filterOpen && (
        <div className="filters">
          <div>
            <label>Content Type</label>
            <button onClick={() => setSelectedContentType("all")}>All</button>
            <button onClick={() => setSelectedContentType("image")}>Image</button>
            <button onClick={() => setSelectedContentType("video")}>Video</button>
            <button onClick={() => setSelectedContentType("audio")}>Audio</button>
          </div>
          <div>
            <label>Category</label>
            <button onClick={() => setSelectedCategory("all")}>All</button>
            <button onClick={() => setSelectedCategory("lingerie")}>Lingerie</button>
            <button onClick={() => setSelectedCategory("roleplay")}>Roleplay</button>
            <button onClick={() => setSelectedCategory("asmr")}>ASMR</button>
          </div>
        </div>
      )}

      <div className="content-grid">
        {sortedContent.map((item) => (
          <div key={item.id} className="content-card">
            <img src={item.image} alt={item.title} />
            <div>
              <span>@{item.creator}</span>
              <span>{item.title}</span>
              <span>{item.price} ETH</span>
              <div>
                <Heart size={16} /> {item.likes} <Eye size={16} /> {item.mintCount}
              </div>
              {item.isSubscription && <span><Lock size={12} /> Subscription</span>}
              {item.isNew && <span>NEW</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
