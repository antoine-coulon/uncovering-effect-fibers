import { Effect } from "effect";

export const DumbRuntime = {
  runSync: <A, E, R>(program: Effect.Effect<A, E, R>) => {
    const primitive = {
      _id: "Effect",
      _op: "Sync",
      effect_instruction_i0: Function,
      effect_instruction_i1: undefined,
      effect_instruction_i2: undefined,
    };

    // @ts-expect-error - Hidden by internals at the type-level
    // core.Primitive
    const effect = program as {
      _op: "Sync";
      effect_instruction_i0: () => unknown;
    };

    switch (effect._op) {
      case "Sync": {
        return effect.effect_instruction_i0();
      }
    }
  },

  runPromise: <A, E, R>(program: Effect.Effect<A, E, R>) => {
    return new Promise((resolve) => {
      // @ts-expect-error - Hidden by internals at the type-level
      // core.Primitive
      const effect = program as {
        _op: "Sync";
        effect_instruction_i0: () => unknown;
      };

      switch (effect._op) {
        case "Sync": {
          return resolve(effect.effect_instruction_i0());
        }
      }
    });
  },
};
