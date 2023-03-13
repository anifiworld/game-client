import CircularProgress from '@mui/material/CircularProgress';
import { map, startCase, toLower } from 'lodash';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export interface IHeroStats {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  STR: string;
  INT: string;
  VIT: string;
  AGI: string;
  RANK: '0' | '1' | '2' | '3' | '4';
}

const enum Heroes {
  Iris = 1,
  Kane = 2,
  Venus = 3,
  Hugo = 4,
  Artemis = 5,
  Loki = 6,
}

const Rarity: { [key: string]: string } = {
  1: 'common',
  2: 'uncommon',
  3: 'rare',
  4: 'epic',
  5: 'legend',
};

const useHeroCard = () => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  const handleGetHeroCard = ({
    id,
    name,
    hero,
    level,
    rarity,
    rank,
    calculated_agi,
    calculated_aspd,
    calculated_atk,
    calculated_def,
    calculated_hp,
    calculated_int,
    calculated_matk,
    calculated_str,
    calculated_vit,
    claimHero = false,
    loading = true,
    claiming = false,
  }: {
    id: string | null;
    name?: string;
    hero?: any;
    level?: string;
    rarity?: string;
    rank?: { value: number };
    calculated_agi?: number;
    calculated_aspd?: number;
    calculated_atk?: number;
    calculated_def?: number;
    calculated_hp?: number;
    calculated_int?: number;
    calculated_matk?: number;
    calculated_str?: number;
    calculated_vit?: number;
    claimHero?: boolean;
    loading?: boolean;
    claiming?: boolean;
  }) => {
    return (
      <>
        {!hero && loading && (
          <>
            <text
              textAnchor="middle"
              style={{
                fontFamily: 'Luckiest Guy',
                fill: '#FFFFFF',
                strokeWidth: 1,
                stroke: '#000000',
                fontSize: sm ? '0.7em' : '1.3em',
                position: 'absolute',
                top: '15%',
                left: claiming ? '28%' : '19%',
              }}
            >
              {claiming ? 'Claiming hero' : 'Waiting for random'}
            </text>
            <CircularProgress
              style={{
                position: 'absolute',
                top: '45%',
                left: '44.5%',
                color: 'white',
              }}
            />
          </>
        )}
        <svg
          viewBox="0 0 361 500"
          cursor="pointer"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          style={{
            marginLeft: claimHero ? '11%' : '',
            marginTop: claimHero ? '3%' : '',
          }}
        >
          <defs>
            <style type="text/css">
              @import
              url("https://fonts.googleapis.com/css2?family=Luckiest+Guy");
            </style>
          </defs>
          <image
            href={
              !rarity
                ? 'https://anifi.io/cards/back-card-logo.png'
                : `https://anifi.io/cards/base-card-${
                    rarity ? rarity : 'common'
                  }.png`
            }
            height={claimHero ? '88%' : '100%'}
            style={{
              filter: !hero ? '' : '',
              opacity: !hero ? '100%' : '100%',
            }}
          />
          {name && (
            <image
              href={`https://anifi.io/cards/${toLower(name)}-card-inner.png`}
              x="11%"
              y="5.9%"
              height="60%"
            />
          )}
          {rank &&
            map(new Array(rank.value), (_, i) => (
              <image
                key={i}
                x={`${
                  (i + 3) * 9 +
                  (rank.value === 1
                    ? 19
                    : rank.value === 2
                    ? 15
                    : rank.value === 3
                    ? 10
                    : rank.value === 4
                    ? 6
                    : 0)
                }%`}
                y="3%"
                href="https://anifi.io/cards/star.png"
                width="8%"
              />
            ))}
          <image
            href={
              !rarity
                ? ''
                : `https://anifi.io/cards/ribbon-card-${
                    rarity ? rarity : 'common'
                  }.png`
            }
            x="5%"
            y="61.5%"
            width="90%"
            style={{
              filter: !rarity ? 'blur(2px)' : '',
              opacity: !rarity ? '80%' : '100%',
            }}
          />
          {calculated_str && (
            <text
              x="35%"
              y="83.5%"
              textAnchor="middle"
              style={{
                fontFamily: 'Luckiest Guy',
                fill: '#FFFFFF',
                strokeWidth: 1.75,
                stroke: '#000000',
                fontSize: '3.25vh',
              }}
            >
              {calculated_str}
            </text>
          )}
          {calculated_vit && (
            <text
              x="35%"
              y="91%"
              textAnchor="middle"
              style={{
                fontFamily: 'Luckiest Guy',
                fill: '#FFFFFF',
                strokeWidth: 1.75,
                stroke: '#000000',
                fontSize: '3.25vh',
              }}
            >
              {calculated_vit}
            </text>
          )}
          {calculated_int && (
            <text
              x="80%"
              y="83.5%"
              textAnchor="middle"
              style={{
                fontFamily: 'Luckiest Guy',
                fill: '#FFFFFF',
                strokeWidth: 1.75,
                stroke: '#000000',
                fontSize: '3.25vh',
              }}
            >
              {calculated_int}
            </text>
          )}
          {calculated_agi && (
            <text
              x="80%"
              y="91%"
              textAnchor="middle"
              style={{
                fontFamily: 'Luckiest Guy',
                fill: '#FFFFFF',
                strokeWidth: 1.75,
                stroke: '#000000',
                fontSize: '3.25vh',
              }}
            >
              {calculated_agi}
            </text>
          )}
          {level && (
            <text
              x="12.25%"
              y="12.25%"
              textAnchor="middle"
              style={{
                fontFamily: 'Luckiest Guy',
                fill: '#FFFFFF',
                strokeWidth: 1.75,
                stroke: '#000000',
                fontSize: '4.75vh',
              }}
            >
              {level}
            </text>
          )}
          <text
            x="50%"
            y="70%"
            textAnchor="middle"
            style={{
              fontFamily: 'Luckiest Guy',
              fill: '#FFFFFF',
              strokeWidth: 1.75,
              stroke: '#000000',
              fontSize: '4vh',
            }}
          >
            {startCase(name)}
          </text>
        </svg>
      </>
    );
  };

  return {
    onHeroCard: handleGetHeroCard,
  };
};

export default useHeroCard;
