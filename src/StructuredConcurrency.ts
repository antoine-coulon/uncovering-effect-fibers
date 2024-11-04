import { Effect, Exit, Fiber, Scope, pipe } from "effect";

const child = Effect.gen(function* () {
  yield* Effect.forever(Effect.delay(1000)(Effect.log("In Child")));
});

const program = Effect.gen(function* () {
  const scope = yield* Scope.make();

  const parent = Effect.gen(function* () {
    yield* Effect.forkIn(scope)(child);

    yield* Effect.repeat({ times: 15 })(
      Effect.delay(400)(Effect.log("In Parent"))
    );
  });

  yield* Effect.forkDaemon(parent);  

  yield* Effect.delay(1000)(Scope.close(scope, Exit.succeed(0))); 
});

program.pipe(Effect.runFork);
