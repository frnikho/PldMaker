import React from "react";

import Lottie from 'lottie-react'
import {Button} from "carbon-components-react";
import {useNavigate} from "react-router-dom";

export function PageNotFound() {

  const navigate = useNavigate();

  return (
    <div style={{margin: 'auto'}}>
      <Lottie animationData={require('../../assets/animations/page-not-found.json')} loop={true} style={{width: '500px', margin: 'auto'}}/>
      <Button kind={"ghost"} onClick={() => navigate('/')}>Retourner a la page principale</Button>
    </div>
  );
}
