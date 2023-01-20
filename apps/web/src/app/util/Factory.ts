import { Dod, DodStatus, Organization, Pld, PldRevision, Review, User, UserDomain, UserWorkTime, WorkTimeFormat } from "@pld/shared";
import { Timezone } from "@pld/utils";

export const createFakeUser = (): User => ({
  email: 'picsou@banquedefrance.com',
  firstname: 'Balthazar',
  lastname: 'Picsou',
  devices: [],
  domain: [],
  roles: [],
  timezone: Timezone["Europe/Paris"],
  _id: '',
  password: '',
  created_date: new Date(),
  updated_date: new Date(),
  preference: {
    email: {
      sendAlertEmail: true,
      sendAllEmail: true,
      sendLoginEmail: true,
      sendNewsEmail: true,
    }
  },
  profile_picture: '',
})

export const createFakeOrg = (owner?: User): Organization => ({
  description: '',
  _id: '',
  owner: owner ?? createFakeUser(),
  created_date: new Date(),
  history: [],
  updated_date: new Date(),
  sections: [],
  picture: '',
  versionShifting: 0.1,
  members: [],
  name: 'Donald City Bank'
})

export const createFakePld = (org?: Organization, owner?: User, manager?: User): Pld => ({
  description: 'Hello World from Picsou mobile',
  version: 1.0,
  org: org ?? createFakeOrg(),
  _id: '123456',
  title: 'PLD_KICKOFF_13_10_2022',
  created_date: new Date(),
  updated_date: new Date(),
  promotion: 2024,
  status: 'Edition',
  currentStep: 'Kick-Off',
  tags: ['Pld', 'Kick-Off', '2024'],
  owner: owner ?? createFakeUser(),
  manager: manager ?? createFakeUser(),
  revisions: [createFakeRevision({owner: owner, sections: ['DoDs']}), createFakeRevision({owner: owner, version: 1.1}), createFakeRevision({owner: owner, version: 1.2})],
  endingDate: new Date(),
  history: [],
  picture: '',
  startingDate: new Date(),
  steps: []
})

export const createFakeRevision = (rev?: Partial<PldRevision>): PldRevision => ({
  created_date: rev?.created_date ?? new Date(),
  owner: rev?.owner ?? createFakeUser(),
  sections: rev?.sections ?? ['Toutes'],
  version: rev?.version ?? 1.0,
  comments: rev?.comments ?? 'Modifications en vue du KO',
  currentStep: rev?.currentStep ?? 'Kick-Off'
})

export const createFakeStatus = (status?: Partial<DodStatus>): DodStatus => ({
  _id: status?._id ?? '',
  org: status?.org ?? createFakeOrg(),
  name: status?.name ?? '',
  createdDate: status?.createdDate ?? new Date(),
  color: status?.color ?? '',
  updatedDate: status?.updatedDate ?? new Date(),
  useDefault: status?.useDefault ?? false,
})

export const createFakeDod = (dod?: Partial<Dod>): Dod => ({
  description: dod?.description ?? 'Je veux créer un bouton pour permettre a un utilisateur de s\'inscrire',
  _id: dod?._id ?? '',
  created_date: dod?.created_date ?? new Date(),
  owner: dod?.owner ?? createFakeUser(),
  updated_date: new Date(),
  history: dod?.history ?? [],
  title: dod?.title ?? '',
  version: dod?.version ?? '1.4',
  pldOwner: dod?.pldOwner ?? createFakePld(),
  status: dod?.status ?? createFakeStatus(),
  descriptionOfDone: dod?.descriptionOfDone ?? ['Créer un bouton', 'Créer le design autour du bouton', 'Rediriger l\'utilisateur sur une la page d\'inscription'],
  estimatedWorkTime: dod?.estimatedWorkTime ?? [],
  skinOf: dod?.skinOf ?? 'Développeur',
  want: dod?.want ?? 'Créer un bouton pour se connecter',
  sketch: false,
})

export const createFakeWorkTime = (users?: User[]): UserWorkTime => {
  return {
    users: users ?? [createFakeUser()],
    value: 2,
    format: WorkTimeFormat.JOUR_HOMME,
  }
}
export const createFakeReview = (review?: Partial<Review>): Review => ({
  comment: review?.comment ?? 'RAS',
  blockingPoint: review?.blockingPoint ?? 'RAS',
  domains: review?.domains ?? [
    {
      domain: UserDomain.CLOUD,
      advancement: '80%'
    },
    {
      domain: UserDomain.SERVER,
      advancement: '80%'
    },
    {
      domain: UserDomain.DEVOPS,
      advancement: '40%',
    },
    {
      domain: UserDomain.MOBILE,
      advancement: '60%'
    },
    {
      domain: UserDomain.OTHER,
      advancement: '60%'
    },
    {
      domain: UserDomain.WEB,
      advancement: '70%'
    },
    {
      domain: UserDomain.VPS,
      advancement: '90%'
    }
  ]
})
