import React, { useRef, useState, useEffect } from "react";

import "./collectionSection.scss";
import publicURL from "../../utils/publicURL";

const opacityForBlock = (sectionProgress, blockNo, innerWidth) => {
  if (innerWidth > 768) {
    let progress = sectionProgress - blockNo;
    if (blockNo % 2 === 1) progress += 1;
    progress /= 2;
    if (progress >= -0.2 && progress < 0.8) return 1;
    return 0.2;
  }
  return 1;
};

function CollectionSection({ collection, scrollY, numberOfPage }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const refContainer = useRef(null);
  let currentPage = 0;

  const { current: elContainer } = refContainer;

  const handleWidth = () => {
    setWindowWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWidth);
    return () => {
      window.removeEventListener('resize', handleWidth);
    }
  }, []);

  if (elContainer) {
    const { clientHeight, offsetTop } = elContainer;
    const screenH = window.innerHeight;
    const halfH = screenH / 2;
    const percentY = // 최소: -0,5, 최대: 1.5 가짐
      Math.min(
        clientHeight + halfH, // 1.5
        // halfH - screenH -> -0.5, scrollY - offsetTop 다 내리면 1
        Math.max(-screenH, scrollY - offsetTop) + halfH
      ) / clientHeight;
    currentPage = percentY * numberOfPage * 2;
    console.log("currentPage", currentPage);
  }

  return (
    <div ref={refContainer} className="collection-wrapper-bottom">
      {collection?.cards?.map((card, i) => (
        <div key={card._id} className="imgWrapper">
          <img
            src={publicURL(card.img)}
            alt=""
            style={{
              opacity: opacityForBlock(currentPage, i, windowWidth),
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default CollectionSection;
