```tsx
<Wizard>
  <Wizard.Render>
    {(step) => (
      <div>
        <h1>Step {step + 1}</h1>
      </div>
    )}
  </Wizard.Render>
  <Wizard.Step>
    <div> first step </div>
  </Wizard.Step>
  <Wizard.Step>
    <div> second step </div>
  </Wizard.Step>
  <Wizard.Render>
    {(step, next:()=>void, back:()=>void, setStep:(newStep:number)=>void) => (
      <>
        <Button disabled={currentStep === 0} onClick={() => next()}>
          Back
        </Button>
        <Button disabled={currentStep === 1} onClick={() => back()}>
          Next
        </Button>
      </>
    )}
  </Wizard.Actions>
</Wizard>;
```
