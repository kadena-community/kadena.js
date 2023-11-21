import { Assert, First, IfAny, Prettify, Tail } from '../types';

const if_any_should_return_second_arg_if_first_arg_is_any: Assert<
  IfAny<any, 1, false>,
  1
> = true;

const if_any_should_return_third_arg_if_first_arg_is_not_any: Assert<
  IfAny<unknown, 1, false>,
  false
> = true;

const first_should_return_first_item_of_array: Assert<
  First<[1, 2, 3]>,
  1
> = true;

const first_should_return_the_item_if_array_has_only_one_item: Assert<
  First<[1]>,
  1
> = true;

const first_should_return_never_if_array_is_empty: Assert<
  First<[]>,
  never
> = true;

const prettifyTest: Assert<
  Prettify<{ a: 1 } & { b: 1 }>,
  { a: 1; b: 1 }
> = true;

const tail_should_return_array_tail: Assert<Tail<[1, 2, 3]>, [2, 3]> = true;

const tail_should_return_empty_array_if_input_has_only_one_item: Assert<
  Tail<[3]>,
  []
> = true;

const tail_should_return_never_if_input_is_empty_array: Assert<
  Tail<[]>,
  never
> = true;
