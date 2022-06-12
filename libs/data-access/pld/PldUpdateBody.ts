export class PldUpdateBody {

  pldId: string;
  title?: string;
  description?: string;
  manager?: string;
  promotion?: number;

  constructor(pldId: string, title: string, description: string, manager: string, promotion: number) {
    this.pldId = pldId;
    this.title = title;
    this.description = description;
    this.manager = manager;
    this.promotion = promotion;
  }
}
