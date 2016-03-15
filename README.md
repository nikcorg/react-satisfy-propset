# Validate one in set of props

Utility for having a set of props of which at least one is required to pass validation.

## How to use

    import { Component, PropTypes } from "react";
    import { satisfyOneOf } from "react-satisfy-propset";

    export const MyComponent = ({ beep = "beep-default", boop = "boop-default" }) => (
        <ul>
            <li>beep={beep}</li>
            <li>boop={boop}</li>
        </ul>
    );

    MyComponent.propTypes = satisfyOneOf({
        beep: PropTypes.string.isRequired,
        boop: PropTypes.number.isRequired
    });

    // Combine convential React props and a propSet...

    // ...with Object.assign

    MyComponent.propTypes = Object.assign(
        tweep: PropTypes.string,
        satisfyOneOf({
            beep: PropTypes.string.isRequired,
            boop: PropTypes.number.isRequired
        })
    );

    // ...with object spread

    MyComponent.propTypes = {
        tweep: PropTypes.string.isRequired,
        ...satisfyOneOf({
            beep: PropTypes.string.isRequired,
            boop: PropTypes.number.isRequired
        })
    };

## How it works

When a prop in the prop set has _no value_ (i.e. `null == value`) the rest of the set is validated. If the validation fails a global validation error is returned. When a prop _has a value_ local validation result is returned.

For a propset propTypes definition of:

    {
        beep: PropTypes.string.isRequired,
        boop: PropTypes.string.isRequired
    }

The following input will return a global warning:

    // No field has a value and a global warning is returned twice
    {
        beep: undefined,
        boop: undefined
    }

    // `beep` has an invalid value and its local validation error is returned
    // `boop` has no value and is ignored, but `beep` fails validation and a global validation error is returned
    {
        beep: 123,
        boop: undefined
    }

The following input will return a local warning:

    // `beep` has a valid value
    // `boop` has an invalid value and a local validation error is returned
    {
        beep: "beep",
        boop: 123
    }

The following input will return no warnings:

    // `beep` has a valid value
    // `boop` has no value and is ignored. No warning is returned because `beep` validates
    {
        beep: "beep",
        boop: null
    }

    // `beep` has a value value
    // `boop` has a valid value
    {
        beep: "beep",
        boop: "boop"
    }

## License

MIT

