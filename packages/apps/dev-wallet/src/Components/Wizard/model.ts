export type WizardRenderProp = (actions: WizardStepActions) => React.ReactNode;

export interface WizardStepActions {
  step: number;
  next: () => void;
  back: () => void;
  goTo: (step: number) => void;
}

export interface WizardStepProps extends Partial<WizardStepActions> {
  children: WizardRenderProp;
}
