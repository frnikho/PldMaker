export class PldUpdateBody {

  pldId: string;
  title?: string;
  description?: string;
  manager?: string;
  promotion?: number;
  currentStep?: string;

  constructor(pldId: string, title: string, description: string, manager: string, promotion: number, currentStep: string) {
    this.pldId = pldId;
    this.title = title;
    this.description = description;
    this.manager = manager;
    this.promotion = promotion;
    this.currentStep = currentStep;
  }
}
