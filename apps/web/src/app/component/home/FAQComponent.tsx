import React from "react";
import faq from '../../../assets/configs/faq.json';
import {Accordion, AccordionItem, Button, Link, Tile} from "carbon-components-react";
import {Navigate} from "react-router-dom";
import config from '../../../assets/configs/general.json';

export type FAQProps = {
  home: boolean;
}

export type FAQState = {
  redirect?: string;
}

export class FAQComponent extends React.Component<FAQProps, FAQState> {

  constructor(props: FAQProps) {
    super(props);
    this.state = {
      redirect: undefined,
    }
  }

  private getFAQ() {
    if (!this.props.home)
      return faq.data;
    return faq.data.filter((f) => f.home === this.props.home);
  }

  override render() {
    return (
      <>
        {this.state.redirect ? <Navigate to={this.state.redirect}/> : null}
        <h3 style={{fontWeight: 'bold'}}>FAQ :</h3>
        <Accordion style={{marginTop: 20}}>
          {this.getFAQ().map((f, index) => {
            return (
              <AccordionItem key={index} title={<p style={{fontSize: this.props.home ? 18 : 24}}>{f.title}</p>}>
                <p style={{fontSize: this.props.home ? 14 : 16}}>{f.answers}</p>
              </AccordionItem>
            )
          })}
        </Accordion>
        <Button style={{marginTop: 10, display: this.props.home ? 'flex' : 'none'}} kind={"ghost"} onClick={() => {this.setState({redirect: '/faq'})}}>Voir toutes les questions</Button>
        <Tile style={{display: this.props.home ? 'none' : 'flex'}}>
          <p>Si vous avez d'autre questions ou bien des suggestions a faire, n'hésitez pas a contacter <Link target="_blank" href={config.admin.website}>Votre Administrateur 📧</Link></p>
        </Tile>
      </>
    )
  }

}
