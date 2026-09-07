"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Select, { type SingleValue } from "react-select";

import { useListAllSchoolsQuery } from "@/features/api/apiSlice";
import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { UNLISTED_SCHOOL_VALUE, nextJoinHref } from "@/lib/join";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { JoinFail } from "./JoinFail";
import { JoinShell } from "./JoinShell";

type SchoolOption = { value: string; label: string };

const UNLISTED_OPTION: SchoolOption = {
  value: UNLISTED_SCHOOL_VALUE,
  label: "My school isn't listed",
};

export function JoinCampus() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const form = useAppSelector((s) => s.waitlist.form);

  useEffect(() => {
    if (form.skippedMarket) {
      router.replace(
        nextJoinHref("city", {
          marketId: null,
          skippedMarket: true,
          schoolId: null,
          notInSchool: false,
        }),
      );
    }
  }, [form.skippedMarket, router]);

  const { data, isFetching, isError, refetch } = useListAllSchoolsQuery(
    form.marketId ? { marketId: form.marketId } : undefined,
  );

  const options: SchoolOption[] = [
    ...(data ?? []).map((s) => ({ value: s.id, label: s.name })),
    UNLISTED_OPTION,
  ];

  const selected: SchoolOption | null = form.notInSchool
    ? UNLISTED_OPTION
    : (options.find((o) => o.value === form.schoolId) ?? null);

  const pick = (option: SingleValue<SchoolOption>) => {
    if (!option) {
      dispatch(
        updateWaitlistForm({
          schoolId: null,
          schoolName: null,
          notInSchool: false,
        }),
      );
      return;
    }
    if (option.value === UNLISTED_SCHOOL_VALUE) {
      dispatch(
        updateWaitlistForm({
          schoolId: null,
          schoolName: null,
          notInSchool: true,
        }),
      );
      return;
    }
    dispatch(
      updateWaitlistForm({
        schoolId: option.value,
        schoolName: option.label,
        notInSchool: false,
      }),
    );
  };

  const noneOfThese = () => {
    dispatch(
      updateWaitlistForm({
        notInSchool: true,
        schoolId: null,
        schoolName: null,
      }),
    );
    router.push(
      nextJoinHref("campus", {
        marketId: form.marketId,
        skippedMarket: false,
        schoolId: null,
        notInSchool: true,
      }),
    );
  };

  if (form.skippedMarket) return null;

  return (
    <JoinShell
      slug="campus"
      art="/bubba/campus-hall.png"
      artSide="right"
      canContinue={Boolean(form.schoolId) || form.notInSchool}
    >
      {isError ? (
        <JoinFail what="schools" onRetry={() => void refetch()} />
      ) : null}

      <Select<SchoolOption>
        instanceId="jn-school-select"
        className="jn-select"
        classNamePrefix="jn-select"
        unstyled
        isClearable
        isLoading={isFetching}
        options={options}
        value={selected}
        onChange={pick}
        placeholder="Select school"
        aria-label="Select school"
        menuPlacement="auto"
        maxMenuHeight={280}
        filterOption={(option, rawInput) => {
          if (option.data.value === UNLISTED_SCHOOL_VALUE) return true;
          const query = rawInput.trim().toLowerCase();
          return query ? option.label.toLowerCase().includes(query) : true;
        }}
        noOptionsMessage={() => "No matching school."}
      />

      <p className="jn-or">
        <span>Or</span>
      </p>

      <button type="button" className="jn-none" onClick={noneOfThese}>
        None of these schools
      </button>
    </JoinShell>
  );
}
