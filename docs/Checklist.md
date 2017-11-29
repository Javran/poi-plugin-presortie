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
      enabled: <boolean>,
      target: <Target>,
    }
    ```

    where every `Checklist` object must have a unique id.
    also we will only check enabled items in the list.

- when `type` is `health`

    ```
    {
      type: 'health',
      healthStates: <an Array of HealthState>
      method: <CheckMethod>, // valid range: 0~6
      ignoreUnlocked: <boolean>,
      id: <number>,
      enabled: <boolean>,
    }
    ```

    where `CheckMethod` structure defines how the value should be checked,
    and `HealthState` is one of the following:

    - `full`: `HP = 100%`
    - `normal`: `75% < HP < 100%`
    - `shouha`: `50% < HP <= 75%`
    - `chuuha`: `25% < HP <= 50`
    - `taiha`: `0 < HP <= 25%`

    For example: `healthStates: ['full','normal'], method: {type: 'ge', value: 4}`
    requires at least 4 member of the fleet to have either full or normal health state.

- when `type` is `resupply`

    This structure first count ships in the sortie fleet whose ressupply state
    satisfy `filterMethod`, then check the result number using `qualifyMethod`.

    ```
    {
      type: 'resupply',
      filterMethod: <CheckMethod>, // valid range: 0~100
      qualifyMethod: <CheckMethod>, // valid range: 0~6
      ignoreUnlocked: <boolean>,
      resource: 'fuel' / 'ammo' / 'fuel-and-ammo',
      id: <number>,
      enabled: <boolean>,
    }
    ```

- when `type` is `morale`

    This checker is the same as `resupply` without `resource` field.
    The meaning should be straightforward.

    ```
    {
      type: 'morale',
      filterMethod: <CheckMethod>, // valid range: 0~100
      qualifyMethod: <CheckMethod>, // valid range: 0~6
      ignoreUnlocked: <boolean>,
      id: <number>,
      enabled: <boolean>,
    }
    ```

- when `type` is `fighter-power`

    ```
    {
      type: 'fighter-power',
      method: <CheckMethod>, // valid range 0 ~ (no upper bound)
      mode: 'min' / 'max' / 'basic',
      id: <number>,
      enabled: <boolean>,
    }
    ```

    Since we want this to be serializable in JSON, let's just the maximum
    representable integer in JSON. (In practice I don't think it matters)

- when `type` is one of `aaci`, `oasw`, `has-radar`

    This checker counts the number of ships that have the specific ability,
    and applies `method` against this number to see if it's satisfied.

    ```
    {
      type: <see above>
      method: <CheckMethod>, // valid range 0~6
      id: <number>,
      enabled: <boolean>,
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
      enabled: <boolean>,
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
      enabled: <boolean>,
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
      enabled: <boolean>,
    }
    ```

- when `type` is `los`

    ```
    {
      type: 'los',
      method: <CheckMethod>,
      nodeFactor: <number>,
      id: <number>,
      enabled: <boolean>,
    }
    ```

    Please refer to [Formula 33](http://kancolle.wikia.com/wiki/Line_of_Sight#Formula_33)
    for what `nodeFactor` means.

- when `type` is `extra-slots`

    This checker requires all available (openned) extra slots
    are at least equipped with something.

    ```
    {
      type: 'extra-slots',
      id: <number>,
      enabled: <boolean>,
    }
    ```

- when `type` is `yasen-equips`

    ```
    {
      type: 'yasen-equips',
      searchlight: <CheckMethod>,
      starShell: <CheckMethod>,
      nightRecon: <CheckMethod>,
      skilledLookouts: <CheckMethod>,
      id: <number>,
      enabled: <boolean>,
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

## `Target` structure

a `Target` is a string that takes only few limited values
to indicate which target we are checking against.
If the target we are checking against is not valid,
the checker in question must fail with clear indication
that the target is not available.

Currently a `Target` is one of the following:

- `fleet-X`, where `X` is one of `1`, `2`, `3`, `4`
- (TODO) `combined`, which stands for combined fleet.
- (TODO) `lbas-A-X`, where `A` is area id (`api_area_id` from game API)
  and `X` squadron id (`api_rid` from game API)

Every `Target` will have a type to distinguish between those described above,
for now there are just one of: `fleet`, `combined`, and `lbas`.

(TODO) In future we might make it possible to check against LBAS
or even some other things.

(TODO) Potential plan: implement target checkers for each checker to figure out
which target they are capable of checking.
