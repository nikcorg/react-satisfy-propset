import invariant from "invariant";

const entries = (obj) => Object.keys(obj).map((key) => [key, obj[key]]);

const propValidates = ([name, propValidationFn]) => (props, componentName) => !(propValidationFn(props, name, componentName) instanceof Error);

export const satisfyOneOf = (propSet) => {
    invariant(
        "object" === typeof propSet && null != propSet,
        "Expected propSet to be an object"
    );

    if (2 > Object.keys(propSet).length) {
        return propSet;
    }

    const propSetValidationFailed = `Expected one in [${Object.keys(propSet).join(", ")}] to pass validation`;

    const satisfyOne = (name, propValidationFn) => {
        const restOfPropSet = entries(propSet).filter(([propName]) => propName !== name).map(propValidates);

        return (props, propName, componentName) => {
            const shouldValidateLocally = null != props[propName];

            if (!shouldValidateLocally) {
                return restOfPropSet.some((isValid) => isValid(props, componentName)) || new Error(propSetValidationFailed);
            }

            return propValidationFn(props, propName, componentName);
        };
    };

    return entries(propSet).
        reduce((props, [name, propValidationFn]) => ({
            ...props,
            [name]: satisfyOne(name, propValidationFn)
        }), {});
};
