import { useSpring, animated } from '@react-spring/web';
import styled from 'styled-components';

interface IHP {
  hp: number;
  position?: string;
  isBottom?: boolean;
}

export const HP = (props: IHP) => {
  const styles = useSpring({
    width: `${props.hp < 0 ? 0 : props.hp}%`,
    from: {
      width: '100%',
    }
  });

  return (
    <AnimatedHP
      style={{
        ...styles,
      }}
      position={props.position}
      isBottom={props.isBottom}
    />
  );
};

interface IHPStyleProps {
  hp?: string;
  position?: string;
  isBottom?: boolean
}

const HPSlot = styled.div<IHPStyleProps>`
  height: 100%;
  background-color: ${(props) => props.position === 'top' ? '#C97DF7' : '#0DC016'};
  display: block;
  ${(props) => !props.isBottom && 'border-right: 0.5px solid #000000;'}
  ${(props) => props.isBottom && 'border-radius: 5px;'}
`;

const AnimatedHP = animated(HPSlot);