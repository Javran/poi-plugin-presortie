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

    This structure checks the percentage of HP for a specific target

    ```
    {
      type: 'health',
      target: <CheckTarget>,
      method: <CheckMethod>, // valid range: 0~100
      id: <number>,
    }
    ```

    where `CheckMethod` structure defines how the value should be checked,
    and `CheckTarget` defines what this checker is checking against.

- when `type` is `resupply`

    This structure is mostly like `health` but checks resupply statuses.

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
      method: <CheckMethod>, // valid range 0~5000
      id: <number>,
    }
    ```

- when `type` is one of `aaci`, `oasw`, `has-saiun`, `has-radar`

    This checker counts the number of ships that have the specific ability,
    and applies `method` against this number to see if it's satisfied.

    ```
    {
      type: <see above>
      method: <CheckMethod>, // valid range 0~6
      id: <number>,
    }
    ```

- when `type` is `all-slots`

    This checker counts number of ships whose all slots are equipped.

    ```
    {
      type: 'all-slots'
      method: <CheckMethod>, // valid range 0~6
      ignoreExtra: <bool>,
      id: <number>,
    }
    ```

    if `ignoreExtra` is `true`, this checker will ignore extra slot while checking.

## `CheckMethod` structure

- an Object that at least has the following fields:

    ```
    {
      type: 'le' / 'eq' / 'ge',
      value: <number>,
    }
    ```

    where `type` means:

    - `le`: less or equal to
    - `eq`: equal to
    - `ge`: greater or equal to

- a `CheckMethod` valid range means the range that `value` can take.

## `CheckTarget` structure

a `CheckTarget` is one of the following:

- a string `fs` means flagship of the sortie fleet
- a string `all` means every member of the sortie fleet
