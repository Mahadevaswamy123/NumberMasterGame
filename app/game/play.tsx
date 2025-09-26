import { useRouter } from 'expo-router';
import GameScreen from '../../components/game/GameScreen';

export default function GamePlay() {
  const router = useRouter();
  
  const navigation = {
    navigate: (screen: string) => {
      if (screen === 'LevelSelector') {
        router.push('/game');
      } else if (screen === 'Game') {
        router.push('/game/play');
      }
    }
  };
  
  return <GameScreen navigation={navigation} />;
}
