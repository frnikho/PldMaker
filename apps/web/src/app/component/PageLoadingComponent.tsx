import Lottie from "lottie-react";
import React from "react";
import { useLanguage } from "../hook/useLanguage";

export const PageLoadingComponent = () => {

  const {translate} = useLanguage();

  return (
    <div>
      <h1 style={{fontWeight: 'bold'}}>{translate('lexical.loading')}</h1>
      <Lottie animationData={require('../../assets/animations/hourglass-loading.json')} loop={true} style={{width: '300px', margin: 'auto'}}/>
    </div>
  );
};
