export type WizardRenderProp = (
  actions: WizardElementActions,
) => React.ReactNode;

export interface WizardElementActions {
  step: number;
  next: () => void;
  back: () => void;
  goTo: (step: number) => void;
}

export interface WizardElementProps extends Partial<WizardElementActions> {
  children: WizardRenderProp;
}
