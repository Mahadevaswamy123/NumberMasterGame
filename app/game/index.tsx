import { useRouter } from 'expo-router';
import LevelSelector from '../../components/game/LevelSelector';

export default function GameLevelSelector() {
  const router = useRouter();
  
  const navigation = {
    navigate: (screen: string) => {
      if (screen === 'Game') {
        router.push('/game/play');
      } else if (screen === 'Home') {
        router.push('/');
      }
    }
  };
  
  return <LevelSelector navigation={navigation} />;
}
