import 'aos/dist/aos.css';
import { map } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Providers from './Providers';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import './styles/styles.scss';
import './translations/i18n';

const imageList = [
  // Hero
  'https://anifi.io/cards/base-card-common.png',
  'https://anifi.io/cards/base-card-uncommon.png',
  'https://anifi.io/cards/base-card-rare.png',
  'https://anifi.io/cards/base-card-epic.png',
  'https://anifi.io/cards/venus-card-inner.png',
  'https://anifi.io/cards/hugo-card-inner.png',
  'https://anifi.io/cards/iris-card-inner.png',
  'https://anifi.io/cards/artemis-card-inner.png',
  'https://anifi.io/cards/kane-card-inner.png',
  'https://anifi.io/cards/ribbon-card-common.png',
  'https://anifi.io/cards/ribbon-card-uncommon.png',
  'https://anifi.io/cards/ribbon-card-rare.png',
  'https://anifi.io/cards/ribbon-card-epic.png',
  // Game Assets
  'https://anifi.io/game_assets/packs/basic_pack.png',
  'https://anifi.io/game_assets/packs/uncommon_pack.png',
  'https://anifi.io/game_assets/packs/rare_pack.png',
  'https://anifi.io/game_assets/packs/loki_pack.png',
  'https://anifi.io/game_assets/shards/iris_shard.png',
  'https://anifi.io/game_assets/shards/kane_shard.png',
  'https://anifi.io/game_assets/shards/venus_shard.png',
  'https://anifi.io/game_assets/shards/hugo_shard.png',
  'https://anifi.io/game_assets/shards/artemis_shard.png',
  'https://anifi.io/game_assets/gems/Gem-Status_ATK-01.png',
  'https://anifi.io/game_assets/gems/Gem-Status_ATK-02.png',
  'https://anifi.io/game_assets/gems/Gem-Status_ATK-03.png',
  'https://anifi.io/game_assets/gems/Gem-Status_ATK-04.png',
  'https://anifi.io/game_assets/gems/Gem-Status_MATK-01.png',
  'https://anifi.io/game_assets/gems/Gem-Status_MATK-02.png',
  'https://anifi.io/game_assets/gems/Gem-Status_MATK-03.png',
  'https://anifi.io/game_assets/gems/Gem-Status_MATK-04.png',
  'https://anifi.io/game_assets/gems/Gem-Status_DEF-01.png',
  'https://anifi.io/game_assets/gems/Gem-Status_DEF-02.png',
  'https://anifi.io/game_assets/gems/Gem-Status_DEF-03.png',
  'https://anifi.io/game_assets/gems/Gem-Status_DEF-04.png',
  'https://anifi.io/game_assets/gems/Gem-Status_STR-01.png',
  'https://anifi.io/game_assets/gems/Gem-Status_STR-02.png',
  'https://anifi.io/game_assets/gems/Gem-Status_STR-03.png',
  'https://anifi.io/game_assets/gems/Gem-Status_STR-04.png',
  'https://anifi.io/game_assets/gems/Gem-Status_AGI-01.png',
  'https://anifi.io/game_assets/gems/Gem-Status_AGI-02.png',
  'https://anifi.io/game_assets/gems/Gem-Status_AGI-03.png',
  'https://anifi.io/game_assets/gems/Gem-Status_AGI-04.png',
  'https://anifi.io/game_assets/gems/Gem-Status_VIT-01.png',
  'https://anifi.io/game_assets/gems/Gem-Status_VIT-02.png',
  'https://anifi.io/game_assets/gems/Gem-Status_VIT-03.png',
  'https://anifi.io/game_assets/gems/Gem-Status_VIT-04.png',
  'https://anifi.io/game_assets/gems/Gem-Status_INT-01.png',
  'https://anifi.io/game_assets/gems/Gem-Status_INT-02.png',
  'https://anifi.io/game_assets/gems/Gem-Status_INT-03.png',
  'https://anifi.io/game_assets/gems/Gem-Status_INT-04.png',
  'https://anifi.io/game_assets/rentals/rental14days.png',
  'https://anifi.io/game_assets/rentals/rental14days.png',
  'https://anifi.io/game_assets/rentals/rental14days.png',
  'https://anifi.io/game_assets/rentals/rental14days.png',
  'https://anifi.io/cards/back-card-logo.png',
  'https://anifi.io/cards/star.png',
  // Battle
  require('./assets/image/ui/ribbon-stage.png').default,
  require('./assets/image/bg/bg-battle.png').default,
  require('./assets/image/ui/left-button-stand.png').default,
  require('./assets/image/ui/skill-slot.png').default,
  require('./assets/image/ui/kane-card-inner.png').default,
  require('./assets/image/ui/right-button-stand.png').default,
  require('./assets/image/cutscene/artemis-cutscene.png').default,
  require('./assets/image/cutscene/hugo-cutscene.png').default,
  require('./assets/image/cutscene/iris-cutscene.png').default,
  require('./assets/image/cutscene/kane-cutscene.png').default,
  require('./assets/image/cutscene/loki-cutscene.png').default,
  require('./assets/image/cutscene/venus-cutesence.png').default,
  // Game
  require('./assets/video/hero/mar.webm').default,
  require('./assets/image/hero/d9d28d3442e397718faec0f1941aa62f.png').default,
  require('./assets/video/hero/cha_red.webm').default,
  require('./assets/image/hero/kane.png').default,
  require('./assets/video/hero/exam.webm').default,
  require('./assets/image/hero/4d3845cc415748c6186a475a9ea241ab.png').default,
  require('./assets/video/hero/greenboy.webm').default,
  require('./assets/image/hero/529b68e49f4acb3ed74de04df835338e.png').default,
  require('./assets/video/hero/brown.webm').default,
  require('./assets/image/hero/38913b9b4451c0ccc70816fc31c71a0a.png').default,
  require('./assets/video/hero/loki.webm').default,
  require('./assets/image/hero/f109b990b11469adb82a981151ab5d83.png').default,
  require('./assets/image/ui/a98588acc7dd800f7560712609c7f558.png').default,
  require('./assets/image/ui/62a73bef3579298c5e7d9c2bb59c3e46.png').default,
  require('./assets/image/bg/bg-main.webp').default,
  require('./assets/video/hero/greenboy.webm').default,
  require('./assets/video/hero/greenboy.webm').default,
  require('./assets/image/ui/eb2198d5ef8767dab873f50c5d5a4502.png').default,
  require('./assets/image/ui/abef7c2bb4ff2611fc7326970eafe736.png').default,
  require('./assets/image/ui/aa4ea707fbbf8a1388362297a96a60ba.png').default,
  require('./assets/image/ui/c98cda49d96425c963bd40d0ae9fce15.png').default,
  // Hero
  require('./assets/image/item/hero_dust/Dust-Character-Artemis.png').default,
  require('./assets/image/item/hero_dust/Dust-Character-Venus.png').default,
  require('./assets/image/item/hero_dust/Dust-Character-Hugo.png').default,
  require('./assets/image/item/hero_dust/Dust-Character-Artemis.png').default,
  require('./assets/image/item/hero_dust/Dust-Character-Kane.png').default,
  require('./assets/image/bg/bg-main.webp').default,
  require('./assets/video/home.mp4').default,
  require('./assets/image/home.png').default,
  require('./assets/image/ui/banners/cover_left.png').default,
  require('./assets/image/ui/banners/cover_left.webm').default,
  require('./assets/image/ui/banners/cover_left.png').default,
  require('./assets/image/ui/banners/cover_right.png').default,
  require('./assets/image/ui/banners/cover_right.webm').default,
  require('./assets/image/ui/banners/cover_right.png').default,
  require('./assets/image/ui/052e38287ff1029cec589474967361bc.png').default,
  // Inventory
  require('./assets/image/ui/80516ecdf78581933d8b54071834b508.png').default,
  require('./assets/image/ui/3847df5f256b5076bc8ee7a9aba06702.png').default,
  require('./assets/image/ui/8ab9c4277a7396318145d35bb619c4a5.png').default,
  // Private Sale
  require('./assets/image/bg/bg-main.webp').default,
  require('./assets/image/ui/cute-busd.png').default,
  require('./assets/image/ui/eb2198d5ef8767dab873f50c5d5a4502.png').default,
  require('./assets/image/home.png').default,
  require('./assets/video/home.mp4').default,
  require('./assets/image/ui/banners/cover_left.png').default,
  require('./assets/image/ui/banners/cover_left.webm').default,
  require('./assets/image/ui/banners/cover_right.png').default,
  require('./assets/image/ui/banners/cover_right.webm').default,
  require('./assets/image/ui/arrow-down.png').default,
  // Received Hero
  require('./assets/image/background/2be23f72a3afd79ea4b94347fc60e590.webp')
    .default,
  // Select World
  require('./assets/image/ui/world1-card.png').default,
  require('./assets/image/ui/world1-avatar.svg').default,
  require('./assets/image/ui/coming-soon-card.png').default,
  require('./assets/image/ui/coming-soon-card.png').default,
  require('./assets/image/ui/coming-soon.svg').default,
  require('./assets/image/background/21826a0c3ddafed8ce29f4dd62644ea9.webp')
    .default,
  require('./assets/image/ui/card-title.png').default,
  require('./assets/image/ui/aa4ea707fbbf8a1388362297a96a60ba.png').default,
  // Setting
  require('./assets/image/ui/check-box-purple.png').default,
  require('./assets/image/ui/checked-purple.png').default,
  // Shop
  require('./assets/image/ui/1114f97b356eead12a4f6785b9ecad39.png').default,
  require('./assets/image/ui/d22a1892b142cb444669ecba7cdee0e3.png').default,
  require('./assets/image/ui/a2280d0a9e8bb1b509fbd5b4738cfa84.png').default,
  require('./assets/image/ui/db04ff30924719e791085dd40b241d88.png').default,
  require('./assets/image/background/f30c84572124ab4565b9fda0190896da.webp')
    .default,
  require('./assets/image/ui/4ef6eede10d432137b93f44d7e94797d.png').default,
  require('./assets/image/ui/97e904d8428149bd936a5315d18bd264.png').default,
  // Stage Selection
  require('./assets/image/bg/bg-stage.png').default,
  require('./assets/image/ui/aa4ea707fbbf8a1388362297a96a60ba.png').default,
  // Staking
  require('./assets/image/ui/eb2198d5ef8767dab873f50c5d5a4502.png').default,
  require('./assets/image/home.png').default,
  require('./assets/video/home.mp4').default,
  require('./assets/image/ui/banners/cover_left.png').default,
  require('./assets/image/ui/banners/cover_left.webm').default,
  require('./assets/image/ui/banners/cover_right.png').default,
  require('./assets/image/ui/banners/cover_right.webm').default,
  // Team
  require('./assets/image/background/2be23f72a3afd79ea4b94347fc60e590.webp')
    .default,
  require('./assets/image/639c269e68182d5f124a2916c0351a01.png').default,
  require('./assets/image/ui/1c082fe84500487a94f3d60d47a43c61.png').default,
  // View Hero
  require('./assets/video/hero/mar.webm').default,
  require('./assets/image/hero/d9d28d3442e397718faec0f1941aa62f.png'),
  require('./assets/video/hero/cha_red.webm').default,
  require('./assets/image/hero/kane.png').default,
  require('./assets/video/hero/exam.webm').default,
  require('./assets/image/hero/4d3845cc415748c6186a475a9ea241ab.png').default,
  require('./assets/video/hero/greenboy.webm').default,
  require('./assets/image/hero/529b68e49f4acb3ed74de04df835338e.png').default,
  require('./assets/video/hero/brown.webm').default,
  require('./assets/image/hero/38913b9b4451c0ccc70816fc31c71a0a.png').default,
  require('./assets/video/hero/loki.webm').default,
  require('./assets/image/hero/f109b990b11469adb82a981151ab5d83.png').default,
  require('./assets/image/ui/lock.png').default,
  require('./assets/image/bg/bg-main.webp').default,
  require('./assets/image/ui/star-bg.png').default,
  require('./assets/image/ui/chara-stage.png').default,
  require('./assets/image/ui/star.png').default,
  require('./assets/image/ui/star.png').default,
  // Welcome
  require('./assets/image/background/2be23f72a3afd79ea4b94347fc60e590.webp')
    .default,
  require('./assets/image/ui/48578bf6533b59e262291c4f2f8f1e5d.png').default,
];

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      {map(imageList, (src) => (
        <link as="image" href={src} rel="preload" />
      ))}
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();