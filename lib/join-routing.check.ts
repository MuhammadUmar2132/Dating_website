import {
  joinConfirmationKind,
  nextJoinHref,
  schoolRequired,
} from "./join";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const empty = {
  marketId: null,
  skippedMarket: false,
  schoolId: null,
  notInSchool: false,
};

// Later-review: Continue on city with no card selected skips campus
// and lands on the national confirmation, not the waiting room.
{
  const form = { ...empty, skippedMarket: true };
  assert(nextJoinHref("city", form) === "/waitlist/ambassador", "no-city continue must skip campus");
  assert(joinConfirmationKind(form) === "national", "no-city continue is national confirmation");
  assert(!schoolRequired(form), "no-city join must not require a school");
}

// Later-review: launch city + "none of these" / "my school isn't listed"
// is the city confirmation, not the waiting room.
{
  const noneOfThese = {
    ...empty,
    marketId: "bos",
    skippedMarket: false,
    schoolId: null,
    notInSchool: true,
  };
  assert(joinConfirmationKind(noneOfThese) === "city", "none of these schools is city confirmation");
  assert(
    joinConfirmationKind({ ...noneOfThese, schoolId: "nyu" }) === "city",
    "unlisted still wins over a leftover school id",
  );
}

{
  const waitingRoom = {
    ...empty,
    marketId: "bos",
    schoolId: "bu",
    notInSchool: false,
    skippedMarket: false,
  };
  assert(joinConfirmationKind(waitingRoom) === "waiting-room", "city + school is waiting room");
  assert(nextJoinHref("city", waitingRoom) === "/waitlist/campus", "city continue with a card goes to campus");
  assert(schoolRequired(waitingRoom), "participating-school path requires a school");
}

console.log("join-routing.check: ok");
