```tsx
<StepManager>
  <StepManager.Render>
    {(step) => (
      <div>
        <h1>Step {step + 1}</h1>
      </div>
    )}
  </StepManager.Render>
  <StepManager.Step>
    <div> first step </div>
  </StepManager.Step>
  <StepManager.Step>
    <div> second step </div>
  </StepManager.Step>
  <StepManager.Render>
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
  </StepManager.Actions>
</StepManager>;
```
