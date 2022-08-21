type PrivacyInfo = {
  showName?: boolean,
  showEmail?: boolean,
  showCompanyInfo?: boolean,
  showLocation?: boolean,
  showGender?: boolean,
  showMobile?: boolean,
}

export class Privacy {

  showName: boolean;
  showEmail: boolean;
  showCompanyInfo: boolean;
  showLocation: boolean;
  showGender: boolean;
  showMobile: boolean;

  constructor(privacy: PrivacyInfo) {
    this.showName = privacy?.showName ?? false;
    this.showEmail = privacy.showEmail ?? true;
    this.showCompanyInfo = privacy.showCompanyInfo ?? false;
    this.showLocation = privacy.showLocation ?? false;
    this.showGender = privacy.showGender ?? false;
    this.showMobile = privacy.showMobile ?? false;
  }
}
