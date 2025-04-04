import ContentList from './ContentList';

export default function TrendingContent({ contents }) {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">Trending Content</h2>
      <ContentList contents={contents} title="Trending" />
    </section>
  );
}