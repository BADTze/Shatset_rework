"use client";

import { MONTHS } from "@/constants";
import { populateYears } from "@/lib/utils";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const DateRangePicker = () => {
  const router = useRouter();
  const searchParam = useSearchParams();

  const [mode, setMode] = useState(searchParam.get("mode") || "hourly");
  const [date, setDate] = useState(
    searchParam.get("date") || moment().format("YYYY-MM-DD")
  );
  const [month, setMonth] = useState(
    searchParam.get("month") || moment().format("MM")
  );
  const [year, setYear] = useState(
    searchParam.get("year") || moment().format("YYYY")
  );

  const handleSubmit = () => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set("mode", mode);
    urlSearchParams.set("date", date);
    urlSearchParams.set("month", month);
    urlSearchParams.set("year", year);

    router.replace(`?${urlSearchParams.toString()}`);
  };

  return (
    <div className="flex gap-2 items-center">
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="select select-bordered select-primary w-full max-w-xs text-gray-800"
      >
        <option value="" disabled hidden>
          Mode
        </option>
        <option value="hourly">Hourly</option>
        <option value="daily">Daily</option>
        <option value="monthly">Monthly</option>
      </select>

      {(mode === "monthly" || mode === "daily") && (
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="select select-bordered select-primary w-full max-w-xs text-gray-800"
        >
          <option value="" disabled hidden>
            Year
          </option>
          {populateYears().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      )}

      {mode === "daily" && (
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="select select-bordered select-primary w-full max-w-xs text-gray-800"
        >
          <option value="" disabled hidden>
            Month
          </option>
          {MONTHS.map(({ char, id, numeric }) => (
            <option key={numeric} value={numeric}>
              {char}
            </option>
          ))}
        </select>
      )}

      {mode === "hourly" && (
        <input
          value={date}
          type="date"
          placeholder="Date"
          className="input input-bordered input-primary w-[200px] flex-shrink-0 text-gray-800"
          onChange={(e) => setDate(e.target.value)}
        />
      )}

      <button
        className="btn text-white"
        style={{ backgroundColor: "rgba(239,103,41,255)" }}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default DateRangePicker;
