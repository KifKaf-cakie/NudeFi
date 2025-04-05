import { useRouter } from 'next/router'
import CreatorProfile from '../../components/CreatorProfile'

export default function CreatorPage() {
  const router = useRouter();
  const { handle } = router.query;

  return (
    <CreatorProfile />
  );
}
