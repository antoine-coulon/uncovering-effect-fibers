import { Effect, Fiber } from "effect";
import { Runtime } from "effect/Runtime";
import { DumbRuntime } from "./DumbRuntime";


const promise = new Promise((resolve) => {
  console.log("Promise");
  resolve(1);
});

const effect = Effect.sync(() => {
  console.log("Effect");
  
  return 1;
});


