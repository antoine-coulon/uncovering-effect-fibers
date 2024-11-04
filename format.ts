import { Effect, Exit, Schedule, Scope, pipe } from "effect";

const background = pipe(
  Effect.log("background"),
  Effect.repeat(Schedule.spaced("1 second"))
);

const program = (scope: Scope.Scope) =>
  Effect.gen(function* () {
    yield* Effect.forkIn(scope)(background);
  });

pipe(
  Effect.gen(function* () {
    const scope = yield* Scope.make();

    yield* Effect.forkDaemon(
      pipe(
        Scope.close(scope, Exit.void),
        Effect.zip(Effect.log("Scope closed")),
        Effect.delay("3 second")
      )
    );

    yield* program(scope);
  }),
  Effect.runFork
);
