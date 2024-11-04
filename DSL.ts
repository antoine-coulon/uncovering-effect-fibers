import { pipe } from "effect";

export class Failure<E> {
  readonly _tag = "Failure";
  constructor(readonly failure: E) {}
}

export class Success<A> {
  readonly _tag = "Success";
  constructor(readonly success: A) {}
}

export type Result<E, A> = Failure<E> | Success<A>;

export class IO<E, A> {
  readonly _tag = "IO";
  constructor(readonly thunk: () => Result<E, A>) {}
}

export function succeed<A>(a: A): IO<never, A> {
  return new IO(() => new Success(a));
}

export function fail<E>(e: E): IO<E, never> {
  return new IO(() => new Failure(e));
}

export function succeedWith<A>(f: () => A): IO<never, A> {
  return new IO(() => new Success(f()));
}

export function failWith<E>(f: () => E): IO<E, never> {
  return new IO(() => new Failure(f()));
}

export function tryCatch<E, A>(
  f: () => A,
  onError: (_: unknown) => E
): IO<E, A> {
  return new IO(() => {
    try {
      return new Success(f());
    } catch (e) {
      return new Failure(onError(e));
    }
  });
}

export function chain<A1, E2, A2>(that: (a: A1) => IO<E2, A2>) {
  return function <E1>(self: IO<E1, A1>) {
    return new IO<E1 | E2, A2>(() => {
      const result = self.thunk();

      if (result._tag === "Success") {
        return that(result.success).thunk();
      }

      return result;
    });
  };
}

export function suspend<E, A>(f: () => IO<E, A>): IO<E, A> {
  return new IO(() => f().thunk());
}

export function run<E, A>(io: IO<E, A>): Result<E, A> {
  return io.thunk();
}

const program = pipe(
  succeed(0),
  chain((n) => succeed(n + 1)),
  chain((n) => succeed(n * 2)),
  chain((n) =>
    succeedWith(() => {
      console.log(`computed: ${n}`);
    })
  ),
);

run(program)


