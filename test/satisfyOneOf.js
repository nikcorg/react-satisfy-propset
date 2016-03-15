import test from "tape";
import sinon from "sinon";
import { satisfyOneOf } from "../src/satisfyOneOf"

test("satisfyOneOf", t => {
    t.test("throws on invalid propSet", t => {
        t.plan(4);

        t.throws(() => satisfyOneOf());
        t.throws(() => satisfyOneOf(null));
        t.throws(() => satisfyOneOf("hello"));
        t.throws(() => satisfyOneOf(123));
    });

    t.test("returns input for less than two keys", t => {
        t.plan(1);

        const propSet = {};

        t.equal(satisfyOneOf(propSet), propSet);
    });

    t.test("returns error when no props validate", t => {
        t.plan(2);

        const strictPropSet = {
            beep: sinon.stub().returns(new Error()),
            boop: sinon.stub().returns(new Error())
        };

        const loosePropSet = satisfyOneOf(strictPropSet);

        const result = loosePropSet.beep({ beep: null, boop: null }, "beep", "ComponentName");

        t.ok(result instanceof Error);
        t.ok(/^Expected one in/.test(result.message));
    });

    t.test("returns return value from validation function when prop has value", t => {
        t.plan(1);

        const strictPropSet = {
            beep: sinon.stub().returns("beep validates ok"),
            boop: sinon.stub().returns(new Error())
        };

        const loosePropSet = satisfyOneOf(strictPropSet);

        const result = loosePropSet.beep({ beep: "beep", boop: null }, "beep", "ComponentName");

        t.equal(result, "beep validates ok");
    });

    t.test("returns true when other props in set validates", t => {
        t.plan(1);

        const strictPropSet = {
            beep: sinon.stub().returns("beep validates ok"),
            boop: sinon.stub().returns(new Error())
        };

        const loosePropSet = satisfyOneOf(strictPropSet);

        const result = loosePropSet.boop({ beep: "beep", boop: null }, "boop", "ComponentName");

        t.equal(result, true);
    });

    t.test("returns local validation error when prop has value", t => {
        t.plan(2);

        const strictPropSet = {
            beep: sinon.stub().returns("beep validates ok"),
            boop: sinon.stub().returns(new Error("boop validation failed"))
        };

        const loosePropSet = satisfyOneOf(strictPropSet);

        const result = loosePropSet.boop({ beep: "beep", boop: "boop" }, "boop", "ComponentName");

        t.ok(result instanceof Error);
        t.equal(result.message, "boop validation failed");
    });
});
