import React from "react";
import {RequiredUserContextProps} from "../../../context/UserContext";
import {FieldData, FieldError} from "../../../util/FieldData";
import {NewCalendarBody, Pld} from "@pld/shared";
import {PldApiController} from "../../../controller/PldApiController";
import {Button, ButtonSet, ClickableTile, DatePicker, DatePickerInput, FormLabel, TextArea, TextInput} from "carbon-components-react";

import {Add, CheckmarkOutline, CircleDash} from '@carbon/icons-react';

import {Stack} from '@carbon/react';
import {HelpLabel, RequiredLabel} from "../../../util/Label";
import {Deadline} from "@pld/utils";
import { validate } from "class-validator";
import {CalendarApiController} from "../../../controller/CalendarApiController";
import {toast} from "react-toastify";

export type NewCalendarProps = {
  orgId: string;
} & RequiredUserContextProps;

export type NewCalendarState = {
  pld: FieldData<Pld[]>
  selectedPld: FieldData<string[]>
  errors: FieldError[];
}

export class NewCalendarComponent extends React.Component<NewCalendarProps, NewCalendarState> {

  constructor(props: NewCalendarProps) {
    super(props);
    this.state = {
      errors: [],
      pld: {
        loading: true,
        value: [],
      },
      selectedPld: {
        loading: false,
        value: []
      }
    }
    this.onSelectPld = this.onSelectPld.bind(this);
  }

  override componentDidMount() {
    PldApiController.findOrgPld(this.props.userContext.accessToken, this.props.orgId, (pld, error) => {
      if (error) {
        console.log(error);
      } else {
        this.setState({
          pld: {
            value: pld,
            loading: false,
          }
        })
      }
    })
  }

  private onSelectPld(pld: Pld, selected: boolean) {
    if (!selected) {
      this.state.selectedPld.value.push(pld._id);
    } else {
      const index = this.state.selectedPld.value.findIndex((a) => a === pld._id);
      this.state.selectedPld.value.splice(index, 1);
    }
    this.setState({});
  }

  private showPld() {
    if (this.state.pld.value.length === 0) {
      return <p>Vous n'avez pas de PLD de créer !</p>
    }
    return this.state.pld.value.map((value, index) => {
      const clicked = this.state.selectedPld.value.some((id) => id === value._id)
      return (
        <ClickableTile onClick={() => this.onSelectPld(value, clicked)} key={index} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: clicked ? '#d2d2d2' : ''}}>
          {clicked ? <CheckmarkOutline color={'#0062fe'} style={{marginRight: 20}} /> : <CircleDash color={'#0062fe'} style={{marginRight: 20}}/>}
          <h3>{value.title}</h3>
        </ClickableTile>
      )
    })
  }

  private onClickCreate(event: any) {
    const title: string = event.currentTarget.form?.elements[0].value;
    const description: string = event.currentTarget.form?.elements[1].value;
    const deadlineStart: string = event.currentTarget.form?.elements[2].value;
    const deadlineEnd: string = event.currentTarget.form?.elements[3].value;
    const calendar: NewCalendarBody = new NewCalendarBody(title, description, new Deadline(new Date(Date.parse(deadlineStart)), new Date(Date.parse(deadlineEnd))), []);
/*    console.table({
      title,
      description,
      deadlineStart,
      deadlineEnd,
    });*/
    validate(calendar).then((errors) => {
      this.setState({
        errors: errors.map((er): FieldError => ({
          error: Object.entries(er.constraints ?? {}).map((a) => a[1]).join(', '),
          loading: false,
          id: er.property,
          }
          )
        )});
      return this.state.errors;
    }).then((errors) => {
      if (errors.length <= 0) {
        CalendarApiController.createCalendar(this.props.userContext.accessToken, this.props.orgId, calendar, (calendar, error) => {
          if (calendar) {
            toast('Calendrier créer', {type: 'success', icon: '👍'});
          } else {
            toast('Une erreur est survenue', {type: 'error', icon: '❌'});
          }
        });
      }
    });

  }

  override render() {
    return (
      <form>
        <Stack gap={4}>
          <h2>Créer un Calendrier</h2>
          <h4>Info</h4>
          <TextInput id={"calendar-title"} invalid={this.state.errors.some((a) => a.id === 'name')} invalidText={this.state.errors.find((a) => a.id === 'name')?.error} labelText={<RequiredLabel message={"Nom"}/>}/>
          <TextArea id={"calendar-description"} invalid={this.state.errors.some((a) => a.id === 'description')} invalidText={this.state.errors.find((a) => a.id === 'description')?.error} labelText={"Description"}/>
          <FormLabel>Deadline</FormLabel>
          <DatePicker datePickerType="range" style={{padding: 4}}>
            <DatePickerInput
              id="date-picker-input-id-start"
              placeholder="mm/dd/yyyy"
              labelText="Start date"
            />
            <DatePickerInput
              id="date-picker-input-id-finish"
              placeholder="mm/dd/yyyy"
              labelText="End date"
            />
          </DatePicker>
          <HelpLabel message={"La deadline d'un calendrier n'est pas obligatoire mais vous permet de vous retrouvez dans l'avancement de votre EIP"}/>
          <h4>Linker un/des PLD avec le calendrier</h4>
          {this.showPld()}
          <ButtonSet style={{marginTop: 10}}>
            <Button renderIcon={Add} iconDescription={"Add"} onClick={(event) => this.onClickCreate(event)}>Créer</Button>
          </ButtonSet>
        </Stack>
      </form>
    )
  }

}
