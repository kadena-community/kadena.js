import { enforce, guard } from '../fw';

/*
  (defun validate-account (account:string)
    @doc "Enforce that an account name conforms to the coin contract \
         \minimum and maximum length requirements, as well as the    \
         \latin-1 character set."

    (enforce
      (is-charset COIN_CHARSET account)
      (format
        "Account does not conform to the coin contract charset: {}"
        [account]))

    (let ((account-length (length account)))

      (enforce
        (>= account-length MINIMUM_ACCOUNT_LENGTH)
        (format
          "Account name does not conform to the min length requirement: {}"
          [account]))

      (enforce
        (<= account-length MAXIMUM_ACCOUNT_LENGTH)
        (format
          "Account name does not conform to the max length requirement: {}"
          [account]))
      )
  )
*/

export function enforceValidateAccount(account: string) {
  enforce(
    Boolean(account),
    'INVALID ACCOUNT',
    `Account does not conform to the account restrictions: ${account}`,
  );
}

/*
  (defun enforce-reserved:bool (account:string guard:guard)
    @doc "Enforce reserved account name protocols."
    (if (validate-principal guard account)
      true
      (let ((r (check-reserved account)))
        (if (= r "")
          true
          (if (= r "k")
            (enforce false "Single-key account protocol violation")
            (enforce false
              (format "Reserved protocol guard violation: {}" [r]))
            )))))
 */
export function enforceReserved(account: string, guard: guard) {
  const columnIndex = account.search(':');
  enforce(
    columnIndex === -1 || guard.principal === account,
    'INVALID ACCOUNT',
    `account guard protocol violation: ${account}`,
  );
}
