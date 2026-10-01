import { Layout } from '../components/Layout';
import { Hero } from '../sections/home/Hero';
import { Story } from '../sections/home/Story';
import { GameplayLoop } from '../sections/home/GameplayLoop';
import { Worlds } from '../sections/home/Worlds';
import { Characters } from '../sections/home/Characters';
import { Features } from '../sections/home/Features';
import { MazeCraft } from '../sections/home/MazeCraft';
import { FinalCta } from '../sections/home/FinalCta';

export default function Home() {
  return (
    <Layout page="home">
      <Hero />
      <Story />
      <GameplayLoop />
      <Worlds />
      <Characters />
      <Features />
      <MazeCraft />
      <FinalCta />
    </Layout>
  );
}
