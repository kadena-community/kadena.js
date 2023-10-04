
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;
type AnyFunc = (...arg: Any) => Any;
type Func<I extends Any[], O> = (...args: I) => O;
type UnaryFunction<I, O> = (arg: Awaited<I>) => O;
type Output<T> = T extends Promise<Any> ? T : Promise<T>;
export interface IAsyncPipe {
    <T1 extends Any[], TOut, F1 extends AnyFunc>(
   op1: F1 extends Func<T1, TOut> ? F1 : Func<T1, TOut>

  ): {
    inputs: [F1];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, TOut, F1 extends AnyFunc, F2 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, TOut> ? F2 : UnaryFunction<T2, TOut>

  ): {
    inputs: [F1, F2];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, TOut> ? F3 : UnaryFunction<T3, TOut>

  ): {
    inputs: [F1, F2, F3];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, T4, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc, F4 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, T4> ? F3 : UnaryFunction<T3, T4>,
op4: F4 extends UnaryFunction<T4, TOut> ? F4 : UnaryFunction<T4, TOut>

  ): {
    inputs: [F1, F2, F3, F4];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, T4, T5, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc, F4 extends AnyFunc, F5 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, T4> ? F3 : UnaryFunction<T3, T4>,
op4: F4 extends UnaryFunction<T4, T5> ? F4 : UnaryFunction<T4, T5>,
op5: F5 extends UnaryFunction<T5, TOut> ? F5 : UnaryFunction<T5, TOut>

  ): {
    inputs: [F1, F2, F3, F4, F5];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, T4, T5, T6, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc, F4 extends AnyFunc, F5 extends AnyFunc, F6 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, T4> ? F3 : UnaryFunction<T3, T4>,
op4: F4 extends UnaryFunction<T4, T5> ? F4 : UnaryFunction<T4, T5>,
op5: F5 extends UnaryFunction<T5, T6> ? F5 : UnaryFunction<T5, T6>,
op6: F6 extends UnaryFunction<T6, TOut> ? F6 : UnaryFunction<T6, TOut>

  ): {
    inputs: [F1, F2, F3, F4, F5, F6];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, T4, T5, T6, T7, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc, F4 extends AnyFunc, F5 extends AnyFunc, F6 extends AnyFunc, F7 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, T4> ? F3 : UnaryFunction<T3, T4>,
op4: F4 extends UnaryFunction<T4, T5> ? F4 : UnaryFunction<T4, T5>,
op5: F5 extends UnaryFunction<T5, T6> ? F5 : UnaryFunction<T5, T6>,
op6: F6 extends UnaryFunction<T6, T7> ? F6 : UnaryFunction<T6, T7>,
op7: F7 extends UnaryFunction<T7, TOut> ? F7 : UnaryFunction<T7, TOut>

  ): {
    inputs: [F1, F2, F3, F4, F5, F6, F7];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, T4, T5, T6, T7, T8, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc, F4 extends AnyFunc, F5 extends AnyFunc, F6 extends AnyFunc, F7 extends AnyFunc, F8 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, T4> ? F3 : UnaryFunction<T3, T4>,
op4: F4 extends UnaryFunction<T4, T5> ? F4 : UnaryFunction<T4, T5>,
op5: F5 extends UnaryFunction<T5, T6> ? F5 : UnaryFunction<T5, T6>,
op6: F6 extends UnaryFunction<T6, T7> ? F6 : UnaryFunction<T6, T7>,
op7: F7 extends UnaryFunction<T7, T8> ? F7 : UnaryFunction<T7, T8>,
op8: F8 extends UnaryFunction<T8, TOut> ? F8 : UnaryFunction<T8, TOut>

  ): {
    inputs: [F1, F2, F3, F4, F5, F6, F7, F8];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, T4, T5, T6, T7, T8, T9, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc, F4 extends AnyFunc, F5 extends AnyFunc, F6 extends AnyFunc, F7 extends AnyFunc, F8 extends AnyFunc, F9 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, T4> ? F3 : UnaryFunction<T3, T4>,
op4: F4 extends UnaryFunction<T4, T5> ? F4 : UnaryFunction<T4, T5>,
op5: F5 extends UnaryFunction<T5, T6> ? F5 : UnaryFunction<T5, T6>,
op6: F6 extends UnaryFunction<T6, T7> ? F6 : UnaryFunction<T6, T7>,
op7: F7 extends UnaryFunction<T7, T8> ? F7 : UnaryFunction<T7, T8>,
op8: F8 extends UnaryFunction<T8, T9> ? F8 : UnaryFunction<T8, T9>,
op9: F9 extends UnaryFunction<T9, TOut> ? F9 : UnaryFunction<T9, TOut>

  ): {
    inputs: [F1, F2, F3, F4, F5, F6, F7, F8, F9];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, T4, T5, T6, T7, T8, T9, T10, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc, F4 extends AnyFunc, F5 extends AnyFunc, F6 extends AnyFunc, F7 extends AnyFunc, F8 extends AnyFunc, F9 extends AnyFunc, F10 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, T4> ? F3 : UnaryFunction<T3, T4>,
op4: F4 extends UnaryFunction<T4, T5> ? F4 : UnaryFunction<T4, T5>,
op5: F5 extends UnaryFunction<T5, T6> ? F5 : UnaryFunction<T5, T6>,
op6: F6 extends UnaryFunction<T6, T7> ? F6 : UnaryFunction<T6, T7>,
op7: F7 extends UnaryFunction<T7, T8> ? F7 : UnaryFunction<T7, T8>,
op8: F8 extends UnaryFunction<T8, T9> ? F8 : UnaryFunction<T8, T9>,
op9: F9 extends UnaryFunction<T9, T10> ? F9 : UnaryFunction<T9, T10>,
op10: F10 extends UnaryFunction<T10, TOut> ? F10 : UnaryFunction<T10, TOut>

  ): {
    inputs: [F1, F2, F3, F4, F5, F6, F7, F8, F9, F10];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc, F4 extends AnyFunc, F5 extends AnyFunc, F6 extends AnyFunc, F7 extends AnyFunc, F8 extends AnyFunc, F9 extends AnyFunc, F10 extends AnyFunc, F11 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, T4> ? F3 : UnaryFunction<T3, T4>,
op4: F4 extends UnaryFunction<T4, T5> ? F4 : UnaryFunction<T4, T5>,
op5: F5 extends UnaryFunction<T5, T6> ? F5 : UnaryFunction<T5, T6>,
op6: F6 extends UnaryFunction<T6, T7> ? F6 : UnaryFunction<T6, T7>,
op7: F7 extends UnaryFunction<T7, T8> ? F7 : UnaryFunction<T7, T8>,
op8: F8 extends UnaryFunction<T8, T9> ? F8 : UnaryFunction<T8, T9>,
op9: F9 extends UnaryFunction<T9, T10> ? F9 : UnaryFunction<T9, T10>,
op10: F10 extends UnaryFunction<T10, T11> ? F10 : UnaryFunction<T10, T11>,
op11: F11 extends UnaryFunction<T11, TOut> ? F11 : UnaryFunction<T11, TOut>

  ): {
    inputs: [F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc, F4 extends AnyFunc, F5 extends AnyFunc, F6 extends AnyFunc, F7 extends AnyFunc, F8 extends AnyFunc, F9 extends AnyFunc, F10 extends AnyFunc, F11 extends AnyFunc, F12 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, T4> ? F3 : UnaryFunction<T3, T4>,
op4: F4 extends UnaryFunction<T4, T5> ? F4 : UnaryFunction<T4, T5>,
op5: F5 extends UnaryFunction<T5, T6> ? F5 : UnaryFunction<T5, T6>,
op6: F6 extends UnaryFunction<T6, T7> ? F6 : UnaryFunction<T6, T7>,
op7: F7 extends UnaryFunction<T7, T8> ? F7 : UnaryFunction<T7, T8>,
op8: F8 extends UnaryFunction<T8, T9> ? F8 : UnaryFunction<T8, T9>,
op9: F9 extends UnaryFunction<T9, T10> ? F9 : UnaryFunction<T9, T10>,
op10: F10 extends UnaryFunction<T10, T11> ? F10 : UnaryFunction<T10, T11>,
op11: F11 extends UnaryFunction<T11, T12> ? F11 : UnaryFunction<T11, T12>,
op12: F12 extends UnaryFunction<T12, TOut> ? F12 : UnaryFunction<T12, TOut>

  ): {
    inputs: [F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc, F4 extends AnyFunc, F5 extends AnyFunc, F6 extends AnyFunc, F7 extends AnyFunc, F8 extends AnyFunc, F9 extends AnyFunc, F10 extends AnyFunc, F11 extends AnyFunc, F12 extends AnyFunc, F13 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, T4> ? F3 : UnaryFunction<T3, T4>,
op4: F4 extends UnaryFunction<T4, T5> ? F4 : UnaryFunction<T4, T5>,
op5: F5 extends UnaryFunction<T5, T6> ? F5 : UnaryFunction<T5, T6>,
op6: F6 extends UnaryFunction<T6, T7> ? F6 : UnaryFunction<T6, T7>,
op7: F7 extends UnaryFunction<T7, T8> ? F7 : UnaryFunction<T7, T8>,
op8: F8 extends UnaryFunction<T8, T9> ? F8 : UnaryFunction<T8, T9>,
op9: F9 extends UnaryFunction<T9, T10> ? F9 : UnaryFunction<T9, T10>,
op10: F10 extends UnaryFunction<T10, T11> ? F10 : UnaryFunction<T10, T11>,
op11: F11 extends UnaryFunction<T11, T12> ? F11 : UnaryFunction<T11, T12>,
op12: F12 extends UnaryFunction<T12, T13> ? F12 : UnaryFunction<T12, T13>,
op13: F13 extends UnaryFunction<T13, TOut> ? F13 : UnaryFunction<T13, TOut>

  ): {
    inputs: [F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc, F4 extends AnyFunc, F5 extends AnyFunc, F6 extends AnyFunc, F7 extends AnyFunc, F8 extends AnyFunc, F9 extends AnyFunc, F10 extends AnyFunc, F11 extends AnyFunc, F12 extends AnyFunc, F13 extends AnyFunc, F14 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, T4> ? F3 : UnaryFunction<T3, T4>,
op4: F4 extends UnaryFunction<T4, T5> ? F4 : UnaryFunction<T4, T5>,
op5: F5 extends UnaryFunction<T5, T6> ? F5 : UnaryFunction<T5, T6>,
op6: F6 extends UnaryFunction<T6, T7> ? F6 : UnaryFunction<T6, T7>,
op7: F7 extends UnaryFunction<T7, T8> ? F7 : UnaryFunction<T7, T8>,
op8: F8 extends UnaryFunction<T8, T9> ? F8 : UnaryFunction<T8, T9>,
op9: F9 extends UnaryFunction<T9, T10> ? F9 : UnaryFunction<T9, T10>,
op10: F10 extends UnaryFunction<T10, T11> ? F10 : UnaryFunction<T10, T11>,
op11: F11 extends UnaryFunction<T11, T12> ? F11 : UnaryFunction<T11, T12>,
op12: F12 extends UnaryFunction<T12, T13> ? F12 : UnaryFunction<T12, T13>,
op13: F13 extends UnaryFunction<T13, T14> ? F13 : UnaryFunction<T13, T14>,
op14: F14 extends UnaryFunction<T14, TOut> ? F14 : UnaryFunction<T14, TOut>

  ): {
    inputs: [F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc, F4 extends AnyFunc, F5 extends AnyFunc, F6 extends AnyFunc, F7 extends AnyFunc, F8 extends AnyFunc, F9 extends AnyFunc, F10 extends AnyFunc, F11 extends AnyFunc, F12 extends AnyFunc, F13 extends AnyFunc, F14 extends AnyFunc, F15 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, T4> ? F3 : UnaryFunction<T3, T4>,
op4: F4 extends UnaryFunction<T4, T5> ? F4 : UnaryFunction<T4, T5>,
op5: F5 extends UnaryFunction<T5, T6> ? F5 : UnaryFunction<T5, T6>,
op6: F6 extends UnaryFunction<T6, T7> ? F6 : UnaryFunction<T6, T7>,
op7: F7 extends UnaryFunction<T7, T8> ? F7 : UnaryFunction<T7, T8>,
op8: F8 extends UnaryFunction<T8, T9> ? F8 : UnaryFunction<T8, T9>,
op9: F9 extends UnaryFunction<T9, T10> ? F9 : UnaryFunction<T9, T10>,
op10: F10 extends UnaryFunction<T10, T11> ? F10 : UnaryFunction<T10, T11>,
op11: F11 extends UnaryFunction<T11, T12> ? F11 : UnaryFunction<T11, T12>,
op12: F12 extends UnaryFunction<T12, T13> ? F12 : UnaryFunction<T12, T13>,
op13: F13 extends UnaryFunction<T13, T14> ? F13 : UnaryFunction<T13, T14>,
op14: F14 extends UnaryFunction<T14, T15> ? F14 : UnaryFunction<T14, T15>,
op15: F15 extends UnaryFunction<T15, TOut> ? F15 : UnaryFunction<T15, TOut>

  ): {
    inputs: [F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc, F4 extends AnyFunc, F5 extends AnyFunc, F6 extends AnyFunc, F7 extends AnyFunc, F8 extends AnyFunc, F9 extends AnyFunc, F10 extends AnyFunc, F11 extends AnyFunc, F12 extends AnyFunc, F13 extends AnyFunc, F14 extends AnyFunc, F15 extends AnyFunc, F16 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, T4> ? F3 : UnaryFunction<T3, T4>,
op4: F4 extends UnaryFunction<T4, T5> ? F4 : UnaryFunction<T4, T5>,
op5: F5 extends UnaryFunction<T5, T6> ? F5 : UnaryFunction<T5, T6>,
op6: F6 extends UnaryFunction<T6, T7> ? F6 : UnaryFunction<T6, T7>,
op7: F7 extends UnaryFunction<T7, T8> ? F7 : UnaryFunction<T7, T8>,
op8: F8 extends UnaryFunction<T8, T9> ? F8 : UnaryFunction<T8, T9>,
op9: F9 extends UnaryFunction<T9, T10> ? F9 : UnaryFunction<T9, T10>,
op10: F10 extends UnaryFunction<T10, T11> ? F10 : UnaryFunction<T10, T11>,
op11: F11 extends UnaryFunction<T11, T12> ? F11 : UnaryFunction<T11, T12>,
op12: F12 extends UnaryFunction<T12, T13> ? F12 : UnaryFunction<T12, T13>,
op13: F13 extends UnaryFunction<T13, T14> ? F13 : UnaryFunction<T13, T14>,
op14: F14 extends UnaryFunction<T14, T15> ? F14 : UnaryFunction<T14, T15>,
op15: F15 extends UnaryFunction<T15, T16> ? F15 : UnaryFunction<T15, T16>,
op16: F16 extends UnaryFunction<T16, TOut> ? F16 : UnaryFunction<T16, TOut>

  ): {
    inputs: [F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc, F4 extends AnyFunc, F5 extends AnyFunc, F6 extends AnyFunc, F7 extends AnyFunc, F8 extends AnyFunc, F9 extends AnyFunc, F10 extends AnyFunc, F11 extends AnyFunc, F12 extends AnyFunc, F13 extends AnyFunc, F14 extends AnyFunc, F15 extends AnyFunc, F16 extends AnyFunc, F17 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, T4> ? F3 : UnaryFunction<T3, T4>,
op4: F4 extends UnaryFunction<T4, T5> ? F4 : UnaryFunction<T4, T5>,
op5: F5 extends UnaryFunction<T5, T6> ? F5 : UnaryFunction<T5, T6>,
op6: F6 extends UnaryFunction<T6, T7> ? F6 : UnaryFunction<T6, T7>,
op7: F7 extends UnaryFunction<T7, T8> ? F7 : UnaryFunction<T7, T8>,
op8: F8 extends UnaryFunction<T8, T9> ? F8 : UnaryFunction<T8, T9>,
op9: F9 extends UnaryFunction<T9, T10> ? F9 : UnaryFunction<T9, T10>,
op10: F10 extends UnaryFunction<T10, T11> ? F10 : UnaryFunction<T10, T11>,
op11: F11 extends UnaryFunction<T11, T12> ? F11 : UnaryFunction<T11, T12>,
op12: F12 extends UnaryFunction<T12, T13> ? F12 : UnaryFunction<T12, T13>,
op13: F13 extends UnaryFunction<T13, T14> ? F13 : UnaryFunction<T13, T14>,
op14: F14 extends UnaryFunction<T14, T15> ? F14 : UnaryFunction<T14, T15>,
op15: F15 extends UnaryFunction<T15, T16> ? F15 : UnaryFunction<T15, T16>,
op16: F16 extends UnaryFunction<T16, T17> ? F16 : UnaryFunction<T16, T17>,
op17: F17 extends UnaryFunction<T17, TOut> ? F17 : UnaryFunction<T17, TOut>

  ): {
    inputs: [F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc, F4 extends AnyFunc, F5 extends AnyFunc, F6 extends AnyFunc, F7 extends AnyFunc, F8 extends AnyFunc, F9 extends AnyFunc, F10 extends AnyFunc, F11 extends AnyFunc, F12 extends AnyFunc, F13 extends AnyFunc, F14 extends AnyFunc, F15 extends AnyFunc, F16 extends AnyFunc, F17 extends AnyFunc, F18 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, T4> ? F3 : UnaryFunction<T3, T4>,
op4: F4 extends UnaryFunction<T4, T5> ? F4 : UnaryFunction<T4, T5>,
op5: F5 extends UnaryFunction<T5, T6> ? F5 : UnaryFunction<T5, T6>,
op6: F6 extends UnaryFunction<T6, T7> ? F6 : UnaryFunction<T6, T7>,
op7: F7 extends UnaryFunction<T7, T8> ? F7 : UnaryFunction<T7, T8>,
op8: F8 extends UnaryFunction<T8, T9> ? F8 : UnaryFunction<T8, T9>,
op9: F9 extends UnaryFunction<T9, T10> ? F9 : UnaryFunction<T9, T10>,
op10: F10 extends UnaryFunction<T10, T11> ? F10 : UnaryFunction<T10, T11>,
op11: F11 extends UnaryFunction<T11, T12> ? F11 : UnaryFunction<T11, T12>,
op12: F12 extends UnaryFunction<T12, T13> ? F12 : UnaryFunction<T12, T13>,
op13: F13 extends UnaryFunction<T13, T14> ? F13 : UnaryFunction<T13, T14>,
op14: F14 extends UnaryFunction<T14, T15> ? F14 : UnaryFunction<T14, T15>,
op15: F15 extends UnaryFunction<T15, T16> ? F15 : UnaryFunction<T15, T16>,
op16: F16 extends UnaryFunction<T16, T17> ? F16 : UnaryFunction<T16, T17>,
op17: F17 extends UnaryFunction<T17, T18> ? F17 : UnaryFunction<T17, T18>,
op18: F18 extends UnaryFunction<T18, TOut> ? F18 : UnaryFunction<T18, TOut>

  ): {
    inputs: [F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc, F4 extends AnyFunc, F5 extends AnyFunc, F6 extends AnyFunc, F7 extends AnyFunc, F8 extends AnyFunc, F9 extends AnyFunc, F10 extends AnyFunc, F11 extends AnyFunc, F12 extends AnyFunc, F13 extends AnyFunc, F14 extends AnyFunc, F15 extends AnyFunc, F16 extends AnyFunc, F17 extends AnyFunc, F18 extends AnyFunc, F19 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, T4> ? F3 : UnaryFunction<T3, T4>,
op4: F4 extends UnaryFunction<T4, T5> ? F4 : UnaryFunction<T4, T5>,
op5: F5 extends UnaryFunction<T5, T6> ? F5 : UnaryFunction<T5, T6>,
op6: F6 extends UnaryFunction<T6, T7> ? F6 : UnaryFunction<T6, T7>,
op7: F7 extends UnaryFunction<T7, T8> ? F7 : UnaryFunction<T7, T8>,
op8: F8 extends UnaryFunction<T8, T9> ? F8 : UnaryFunction<T8, T9>,
op9: F9 extends UnaryFunction<T9, T10> ? F9 : UnaryFunction<T9, T10>,
op10: F10 extends UnaryFunction<T10, T11> ? F10 : UnaryFunction<T10, T11>,
op11: F11 extends UnaryFunction<T11, T12> ? F11 : UnaryFunction<T11, T12>,
op12: F12 extends UnaryFunction<T12, T13> ? F12 : UnaryFunction<T12, T13>,
op13: F13 extends UnaryFunction<T13, T14> ? F13 : UnaryFunction<T13, T14>,
op14: F14 extends UnaryFunction<T14, T15> ? F14 : UnaryFunction<T14, T15>,
op15: F15 extends UnaryFunction<T15, T16> ? F15 : UnaryFunction<T15, T16>,
op16: F16 extends UnaryFunction<T16, T17> ? F16 : UnaryFunction<T16, T17>,
op17: F17 extends UnaryFunction<T17, T18> ? F17 : UnaryFunction<T17, T18>,
op18: F18 extends UnaryFunction<T18, T19> ? F18 : UnaryFunction<T18, T19>,
op19: F19 extends UnaryFunction<T19, TOut> ? F19 : UnaryFunction<T19, TOut>

  ): {
    inputs: [F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19];
    (...args: T1): Output<TOut>;
  };
  
<T1 extends Any[], T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20, TOut, F1 extends AnyFunc, F2 extends AnyFunc, F3 extends AnyFunc, F4 extends AnyFunc, F5 extends AnyFunc, F6 extends AnyFunc, F7 extends AnyFunc, F8 extends AnyFunc, F9 extends AnyFunc, F10 extends AnyFunc, F11 extends AnyFunc, F12 extends AnyFunc, F13 extends AnyFunc, F14 extends AnyFunc, F15 extends AnyFunc, F16 extends AnyFunc, F17 extends AnyFunc, F18 extends AnyFunc, F19 extends AnyFunc, F20 extends AnyFunc>(
   op1: F1 extends Func<T1, T2> ? F1 : Func<T1, T2>,
op2: F2 extends UnaryFunction<T2, T3> ? F2 : UnaryFunction<T2, T3>,
op3: F3 extends UnaryFunction<T3, T4> ? F3 : UnaryFunction<T3, T4>,
op4: F4 extends UnaryFunction<T4, T5> ? F4 : UnaryFunction<T4, T5>,
op5: F5 extends UnaryFunction<T5, T6> ? F5 : UnaryFunction<T5, T6>,
op6: F6 extends UnaryFunction<T6, T7> ? F6 : UnaryFunction<T6, T7>,
op7: F7 extends UnaryFunction<T7, T8> ? F7 : UnaryFunction<T7, T8>,
op8: F8 extends UnaryFunction<T8, T9> ? F8 : UnaryFunction<T8, T9>,
op9: F9 extends UnaryFunction<T9, T10> ? F9 : UnaryFunction<T9, T10>,
op10: F10 extends UnaryFunction<T10, T11> ? F10 : UnaryFunction<T10, T11>,
op11: F11 extends UnaryFunction<T11, T12> ? F11 : UnaryFunction<T11, T12>,
op12: F12 extends UnaryFunction<T12, T13> ? F12 : UnaryFunction<T12, T13>,
op13: F13 extends UnaryFunction<T13, T14> ? F13 : UnaryFunction<T13, T14>,
op14: F14 extends UnaryFunction<T14, T15> ? F14 : UnaryFunction<T14, T15>,
op15: F15 extends UnaryFunction<T15, T16> ? F15 : UnaryFunction<T15, T16>,
op16: F16 extends UnaryFunction<T16, T17> ? F16 : UnaryFunction<T16, T17>,
op17: F17 extends UnaryFunction<T17, T18> ? F17 : UnaryFunction<T17, T18>,
op18: F18 extends UnaryFunction<T18, T19> ? F18 : UnaryFunction<T18, T19>,
op19: F19 extends UnaryFunction<T19, T20> ? F19 : UnaryFunction<T19, T20>,
op20: F20 extends UnaryFunction<T20, TOut> ? F20 : UnaryFunction<T20, TOut>

  ): {
    inputs: [F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20];
    (...args: T1): Output<TOut>;
  };
  
  }