This document defines the structure of `Checklist`, which encodes some pre-sortie checks
that user can define.

# Data Structures

## `Checklist` structure

- an Array of `Checker`s

## `Checker` structure

- an Object that at least has the following fields:

    ```
    {
      type: <string>,
      id: <number>,
    }
    ```

    where every `Checklist` object must have a unique id.

- when `type` is `health`

    This structure first count ships that satisfy `filterMethod` in the sortie fleet,
    then check the result number using `countMethod`.

    ```
    {
      type: 'health',
      target: <CheckTarget>,
      filterMethod: <CheckMethod>, // valid range: 0~100
      countMethod: <CheckMethod>, // valid range: 0~6
      ignoreUnlocked: <boolean>,
      id: <number>,
    }
    ```

    where `CheckMethod` structure defines how the value should be checked,
    and `CheckTarget` defines what this checker is checking against.

    For example: `filterMethod: {type: 'eq', value: 100}, countMethod: {type: 'ge', value: 4}`
    requires at least 4 member of the fleet to be at full health.

- when `type` is `resupply`

    This structure is mostly like `health` but checks resupply statuses. (TODO)

    ```
    {
      type: 'resupply',
      target: <CheckTarget>,
      method: <CheckMethod>, // valid range: 0~100
      id: <number>,
    }
    ```

- when `type` is `fighter-power`

    ```
    {
      type: 'fighter-power',
      method: <CheckMethod>, // valid range 0~Infinity (no upper bound)
      id: <number>,
    }
    ```

- when `type` is one of `aaci`, `oasw`, `has-radar`

    This checker counts the number of ships that have the specific ability,
    and applies `method` against this number to see if it's satisfied.

    ```
    {
      type: <see above>
      method: <CheckMethod>, // valid range 0~6
      id: <number>,
    }
    ```

- when `type` is `count-saiun`

    This checker counts the total number of Saiuns in a fleet
    and applies `method` to see if it's satisfied

    ```
    {
      type: <see above>
      method: <CheckMethod>, // valid range 0~6
      id: <number>,
    }
    ```

- when `type` is `all-slots-empty`

    This checker counts number of ships whose all slots are empty.

    ```
    {
      type: 'all-slots-empty'
      method: <CheckMethod>, // valid range 0~6
      ignoreExtra: <bool>,
      ignoreUnlocked: <bool>,
      id: <number>,
    }
    ```

    - if `ignoreExtra` is `true`, this checker will ignore extra slot while checking.
    - if `ignoreUnlocked` is `true`, this checker will ignore unlocked ships.

- when `type` is `fast-fleet`

    This checker requires all fleet members to be at least fast.

    ```
    {
      type: 'fast-fleet',
      id: <number>,
    }
    ```

## `CheckMethod` structure

- an Object that at least has the following fields:

    ```
    {
      type: 'lt' / 'le' / 'eq' / 'ge' / 'gt',
      value: <number>,
    }
    ```

    where `type` means:

    - `lt`: less than
    - `le`: less than or equal to
    - `eq`: equal to
    - `ge`: greater than or equal to
    - `gt`: greater than

- a `CheckMethod` valid range means the range that `value` can take.

## `CheckTarget` structure

a `CheckTarget` is one of the following:

- a string `fs` means flagship of the sortie fleet
- a string `all` means every member of the sortie fleet
