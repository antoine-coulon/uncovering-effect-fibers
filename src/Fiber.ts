import { Effect, Fiber, Runtime, Schedule, pipe } from "effect";

const Program = pipe(
  Effect.log("Yielding from Fiber"),
  Effect.zip(Effect.log("Zipping with another Fiber"), {
    concurrent: true,
  })
);

Effect.gen(function* () {
  const fiber1 = yield* Effect.forkDaemon(
    Effect.repeat({
      times: 10,
      schedule: Schedule.spaced("1 second"),
    })(Effect.log("Fiber 1"))
  );

  const fiber2 = yield* Effect.forkDaemon(
    Effect.repeat({
      times: 10,
      schedule: Schedule.spaced("2 second"),
    })(Effect.log("Fiber 2"))
  );

  yield* Effect.forkDaemon(Effect.forever(
    pipe(
      fiber2.status,
      Effect.zip(fiber1.status),
      Effect.flatMap(([s1, s2]) => Effect.log(s1._tag, s2._tag)), 
      Effect.delay(1000),
    )
  ))

  yield* Effect.delay("2 second")(Fiber.interrupt(fiber1));

  const runtime = yield* Effect.runtime();
  console.log(runtime.runtimeFlags);
}).pipe(Effect.runPromise);
// Program.pipe(Effect.runSync);
