import React, {
  useState,
  useEffect
} from 'react';
import useScrollPosition from '../../hooks/useScrollPosition';
import ModalStage from '../ModalStageDetail';
import CarouselItem from './carouselItem';
import CarouselControls from './carouselControls';
import './carousel.scss';

interface ICarousel {
  data: any;
}

const Carousel = (props: ICarousel) => {
  const { 
    data 
  } = props;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [stageSectedId, setStageSectedId] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [dataStage, setDataStage] = useState<{
    id: string;
    image: string;
    stages: {
      id: number;
      number: string;
      staminaCost: string;
      status: string;
      boostCost: number;
      phases: {
        id: number;
        phase_no: number;
      }[];
      monsters: number[];
    }[];
  }[]>([]);
  const scrollPosition = useScrollPosition();

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showModal]);

  const handleClose = () => {
    setShowModal(false);
    setStageSectedId(null);
  };

  const handleOpen = (data: any) => {
    if (data.status) {
      setStageSectedId(data.id);
      setShowModal(true);
    }
  }

  const prev = () => {
    const index = currentSlide > 0 ? currentSlide - 1 : dataStage.length - 1;
    setCurrentSlide(index);
  };

  const next = () => {
    const index = currentSlide < dataStage.length - 1 ? currentSlide + 1 : 0;
    setCurrentSlide(index);
  };
  
  const getStatus = (isCleared: boolean, requireStage: boolean) => {
    if (isCleared) {
      return 'clear';
    } else {
      if (!isCleared && requireStage) {
        return 'current';
      } else {
        return ''
      }
    }
  };

  useEffect(() => {
    let result = [];
    let num = 0;
    let stages: {
      id: number;
      number: string; 
      staminaCost: string; 
      status: string; 
      boostCost: number
      phases: {
        id: number;
        phase_no: number;
      }[];
      monsters: number[]; 
    }[] = [];
    const chunkSize = 3;
    data.stageList?.forEach((stage: any, index: number) => {
      let requireStage = false;
      if (stage.require_stage) {
        const checkIsClearStage = data.stageList.find((s: any) => parseInt(s.name) === stage.require_stage);
        requireStage = checkIsClearStage.is_cleared;
      } else {
        requireStage = true;
      }
      
      stages.push({
        id: stage.id,
        number: stage.name,
        staminaCost: `${stage.stamina_cost}`,
        // status: getStatus(stage.is_cleared, requireStage),
        status: stage.name === '1' ? getStatus(stage.is_cleared, requireStage) : '', // for test
        boostCost: stage.boost_cost,
        phases: stage.phases,
        monsters: stage.monsters,
      })
    });

    for (let i = 0; i < stages.length; i += chunkSize) {
        const chunkStage = stages.slice(i, i + chunkSize);
        num += 1
        result.push({
          id: `${num}`,
          image: require('../../assets/image/stage/stage-bg.png').default,
          stages: chunkStage,
        })
    }

    const currentStage = data.stageList?.filter((stage: any) => !stage.is_cleared && stage.require_stage === null);
    const currentSlide = parseInt(currentStage?.name) > 3 ? Math.ceil(parseInt(currentStage?.name) / 3) - 1 : 0;
    setCurrentSlide(currentSlide);
    setDataStage(result);
  }, [data])

  return (
    <div className='carousel'>
      <div
        className='carousel-inner'
        style={{
          transform: `translateX(${-currentSlide * 100}%)`,
        }}
      >
        {
          dataStage.map((stage, index) => {
            return (
              <CarouselItem 
                key={index} 
                stage={stage}
                onClickItem={handleOpen}
              />
            )
          })
        }
      </div>
      <CarouselControls
        prev={prev}
        next={next}
        currentSlide={currentSlide}
        totalSlide={dataStage.length}
      />
      {
        showModal && (
          <ModalStage
            stageId={stageSectedId}
            show={showModal}
            onClose={handleClose}
            scrollPosition={scrollPosition}
          />
        )
      }
    </div>
  );
};

export default Carousel;