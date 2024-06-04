```tsx
<Stepper>
  {(
    currentStep,
    next: () => void,
    back: () => void,
    setStep: (newStep: number) => void,
  ) => (
    <>
      <CustomStepComponent next={next} back={back} />
      <LastStepComponent back={back} />

      {/* OR */}
      <Button disabled={currentStep === 0} onClick={() => next()}>
        Back
      </Button>
      <Button disabled={currentStep === 1} onClick={() => back()}>
        Next
      </Button>
    </>
  )}
</Stepper>
```
