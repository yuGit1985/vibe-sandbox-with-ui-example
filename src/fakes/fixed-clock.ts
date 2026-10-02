import type { Clock } from "@/ports/clock";

export class FixedClock implements Clock {
  today(): string {
    return "2026-10-03";
  }
}
