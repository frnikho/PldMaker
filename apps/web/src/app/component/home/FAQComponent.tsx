import React from "react";
import faq from '../../../assets/configs/faq.json';
import {Accordion, AccordionItem, Button, Link, Tile} from "carbon-components-react";
import {useNavigate} from "react-router-dom";
import config from '../../../assets/configs/general.json';
import { useLanguage } from "../../hook/useLanguage";

type Props = {
  home: boolean;
};

export const FAQComponent = (props: Props) => {

  const {translate} = useLanguage();
  const navigate = useNavigate();

  const getFAQ = () => {
    if (!props.home)
      return faq.data;
    return faq.data.filter((f) => f.home === props.home);
  }

  return (
    <>
      <h3 style={{fontWeight: 'bold'}}>FAQ :</h3>
      <Accordion style={{marginTop: 20}}>
        {getFAQ().map((f, index) => {
          return (
            <AccordionItem key={index} title={<p style={{fontSize: props.home ? 18 : 24}}>{f.title}</p>}>
              <p style={{fontSize: props.home ? 14 : 16}}>{f.answers}</p>
            </AccordionItem>
          )
        })}
      </Accordion>
      <Button style={{marginTop: 10, display: props.home ? 'flex' : 'none'}} kind={"ghost"} onClick={() => {navigate('/faq')}}>Voir toutes les questions</Button>
      <Tile style={{display: props.home ? 'none' : 'flex'}}>
        <p>{translate('pages.faq.suggestion')} <Link target="_blank" href={config.admin.website}>{translate('pages.faq.admin')}</Link></p>
      </Tile>
    </>
  )
};
