import React from 'react';
import styled from 'styled-components';
import FlexBox from './FlexBox';

interface IPreviewCardHero {
  show: boolean;
  image?: any;
  refPreview: any;
}

const PreviewCardHero = (props: IPreviewCardHero) => {
  const { refPreview, show, image } = props;

  return (
    <>
      <Modal show={show}>
        <Container>
          <FlexBox
            ref={refPreview}
            // @ts-ignore
            css={`
              display: contents;
            `}
          >
            {image}
          </FlexBox>
        </Container>
      </Modal>
    </>
  );
};

interface IPreviewCardHeroStyleProps {
  show: boolean;
}

const Modal = styled.div<IPreviewCardHeroStyleProps>`
  aspect-ratio: 16 / 9;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  display: ${({ show }) => (show ? 'block' : 'none')};
  z-index: 100;
  overflow: hidden;
  z-index: 2000;
`;

const Container = styled.div`
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  position: absolute;
  left: 25%;
  right: 25%;
  top: 25%;
  bottom: 25%;
  margin: auto;
  box-sizing: border-box;
`;

export default PreviewCardHero;