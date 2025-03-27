import { IModeSearchParams } from "@/types";
import { IDataTrend } from "@/types/strapi";
import { getDynamicForm, getHistorianData } from "./historian-fetcher";
import { RHPData } from "@/types";
import moment from "moment";

const queryStatus = (tag: string): string => {
  return `DECLARE @TempTable TABLE(Seq INT IDENTITY, tempTagName NVARCHAR(256)) 
INSERT @TempTable(tempTagName) VALUES ('${tag}')
SELECT v_AnalogLive.TagName, DateTime = convert(nvarchar, DateTime, 21), Value, MinEU = ISNULL(Cast(AnalogTag.MinEU as VarChar(20)),'N/A'), MaxEU = ISNULL(Cast(AnalogTag.MaxEU as VarChar(20)),'N/A')
 FROM v_AnalogLive
LEFT JOIN @TempTable ON TagName = tempTagName
LEFT JOIN AnalogTag ON AnalogTag.TagName = v_AnalogLive.TagName
WHERE v_AnalogLive.TagName IN ('${tag}')
ORDER BY Seq`;
};

export const getStatusData = async (tag: string): Promise<number> => {
  const query = queryStatus(tag);
  const result = (await getHistorianData({ query })) as { Value: number }[];
  return result.length ? result[0].Value : 0;
};

const queryRH = (tag_RH: string) => {
  return `DECLARE @TempTable TABLE(Seq INT IDENTITY, tempTagName NVARCHAR(256)) 
INSERT @TempTable(tempTagName) VALUES ('${tag_RH}')
SELECT v_Live.TagName, DateTime, vValue, MinRaw = ISNULL(Cast(AnalogTag.MinRaw as VarChar(20)),'N/A'), MaxRaw = ISNULL(Cast(AnalogTag.MaxRaw as VarChar(20)),'N/A'), Quality, QualityDetail
 FROM v_Live
LEFT JOIN @TempTable ON TagName = tempTagName
LEFT JOIN AnalogTag ON AnalogTag.TagName =v_Live.TagName
 WHERE v_Live.TagName IN ('${tag_RH}')`;
};

export const getRHData = async (tag_RH: string): Promise<number> => {
  const query = queryRH(tag_RH);
  const result = (await getHistorianData({ query })) as { vValue: number }[];
  return result.length ? result[0].vValue : 0;
};

const queryRHPeriod = (
  startDate: string,
  endDate: string,
  tag_RH: string
): string => {
  return `
    SET NOCOUNT ON;
    DECLARE @StartDate DateTime;
    DECLARE @EndDate DateTime;
    SET @StartDate = '${startDate}';
    SET @EndDate = '${endDate}';
    SET NOCOUNT OFF;
    SELECT DateTime = CONVERT(nvarchar, DateTime, 21), Value, AnalogTag.TagName, Unit = ISNULL(CAST(EngineeringUnit.Unit AS nVarChar(20)), 'N/A')
    FROM (
      SELECT *
      FROM [Runtime].[dbo].[History]
      WHERE History.TagName IN ('${tag_RH}')
      AND wwRetrievalMode = 'cyclic'
      AND wwResolution = 3600000
      AND wwQualityRule = 'Extended'
      AND wwVersion = 'Latest'
      AND DateTime >= @StartDate
      AND DateTime <= @EndDate
    ) temp
    LEFT JOIN [Runtime].[dbo].[AnalogTag] ON AnalogTag.TagName = temp.TagName
    LEFT JOIN [Runtime].[dbo].[EngineeringUnit] ON AnalogTag.EUKey = EngineeringUnit.EUKey
    WHERE temp.StartDateTime >= @StartDate
    AND Value IS NOT NULL
    ORDER BY [DateTime] ASC;
  `;
};

const calculateRunningTime = (data: RHPData[]): number => {
  let totalRunningHours = 0;

  for (let i = 1; i < data.length; i++) {
    const previousEntry = data[i - 1];
    const currentEntry = data[i];
    const deltaValue = currentEntry.Value - previousEntry.Value;

    if (deltaValue > 0) {
      totalRunningHours += 1;
    }
  }
  return totalRunningHours;
};

export const getRHPeriod = async (
  startDate: string,
  endDate: string,
  tag_RH: string
): Promise<number> => {
  const query = queryRHPeriod(startDate, endDate, tag_RH);
  const result = (await getHistorianData({ query })) as RHPData[];

  if (result.length === 0) {
    return 0;
  }
  return calculateRunningTime(result);
};

const queryloadCompressor = () => {
  return `DECLARE @TempTable TABLE(Seq INT IDENTITY, tempTagName NVARCHAR(256)) 
INSERT @TempTable(tempTagName) VALUES ('53_compressor_air_flow_comp_abc_32bar')
SELECT v_Live.TagName, DateTime, vValue, MinRaw = ISNULL(Cast(AnalogTag.MinRaw as VarChar(20)),'N/A'), MaxRaw = ISNULL(Cast(AnalogTag.MaxRaw as VarChar(20)),'N/A')
 FROM v_Live
LEFT JOIN @TempTable ON TagName = tempTagName
LEFT JOIN AnalogTag ON AnalogTag.TagName =v_Live.TagName
 WHERE v_Live.TagName IN ('53_compressor_air_flow_comp_abc_32bar')
ORDER BY Seq`;
};

export const loadCompressor = async (): Promise<number> => {
  const query = queryloadCompressor();
  const result = (await getHistorianData({ query })) as {
    vValue: number | string | null | undefined;
  }[];
  const load =
    result.length && result[0].vValue != null ? Number(result[0].vValue) : 0;
  return parseFloat(load.toFixed(2));
};

export const loadcompPercent = async (): Promise<number> => {
  const query = queryloadCompressor();
  const result = (await getHistorianData({ query })) as { vValue: number }[];
  const load = result.length ? result[0].vValue : 0;
  const maxLoad = 1412;
  const loadPercentage = (load / maxLoad) * 100;
  return parseFloat(loadPercentage.toFixed(2));
};

//Load WTP
const queryConcentrate = () => {
  return `DECLARE @TempTable TABLE(Seq INT IDENTITY, tempTagName NVARCHAR(256)) 
INSERT @TempTable(tempTagName) VALUES ('78_water_concentrate_wtp_pet2')
SELECT v_Live.TagName, DateTime, vValue, MinRaw = ISNULL(Cast(AnalogTag.MinRaw as VarChar(20)),'N/A'), MaxRaw = ISNULL(Cast(AnalogTag.MaxRaw as VarChar(20)),'N/A')
 FROM v_Live
LEFT JOIN @TempTable ON TagName = tempTagName
LEFT JOIN AnalogTag ON AnalogTag.TagName =v_Live.TagName
 WHERE v_Live.TagName IN ('78_water_concentrate_wtp_pet2')
ORDER BY Seq`;
};

const queryMembrane1 = () => {
  return `DECLARE @TempTable TABLE(Seq INT IDENTITY, tempTagName NVARCHAR(256))
INSERT
    @TempTable(tempTagName)
VALUES
    ('78_water_ro_unit_pet2_membrane1')
SELECT
    v_Live.TagName,
    DateTime,
    vValue,
    MinRaw = ISNULL(Cast(AnalogTag.MinRaw as VarChar(20)), 'N/A'),
    MaxRaw = ISNULL(Cast(AnalogTag.MaxRaw as VarChar(20)), 'N/A')
FROM
    v_Live
    LEFT JOIN @TempTable ON TagName = tempTagName
    LEFT JOIN AnalogTag ON AnalogTag.TagName = v_Live.TagName
WHERE
    v_Live.TagName IN ('78_water_ro_unit_pet2_membrane1')
ORDER BY
    Seq`;
};

const queryMembrane2 = () => {
  return `DECLARE @TempTable TABLE(Seq INT IDENTITY, tempTagName NVARCHAR(256))
INSERT
    @TempTable(tempTagName)
VALUES
    ('78_water_ro_unit_pet2_membrane2')
SELECT
    v_Live.TagName,
    DateTime,
    vValue,
    MinRaw = ISNULL(Cast(AnalogTag.MinRaw as VarChar(20)), 'N/A'),
    MaxRaw = ISNULL(Cast(AnalogTag.MaxRaw as VarChar(20)), 'N/A')
FROM
    v_Live
    LEFT JOIN @TempTable ON TagName = tempTagName
    LEFT JOIN AnalogTag ON AnalogTag.TagName = v_Live.TagName
WHERE
    v_Live.TagName IN ('78_water_ro_unit_pet2_membrane2')
ORDER BY
    Seq`;
};

export const concentrateValue = async (): Promise<number> => {
  const query = queryConcentrate();
  const result = (await getHistorianData({ query })) as {
    vValue: number | string | null | undefined;
  }[];
  const load =
    result.length && result[0].vValue != null ? Number(result[0].vValue) : 0;
  return parseFloat(load.toFixed(2));
};

export const loadMembrane1 = async (): Promise<number> => {
  const query = queryMembrane1();
  const result = (await getHistorianData({ query })) as {
    vValue: number | string | null | undefined;
  }[];
  const load =
    result.length && result[0].vValue != null ? Number(result[0].vValue) : 0;
  return parseFloat(load.toFixed(2));
};

export const loadMembrane2 = async (): Promise<number> => {
  const query = queryMembrane2();
  const result = (await getHistorianData({ query })) as {
    vValue: number | string | null | undefined;
  }[];
  const load =
    result.length && result[0].vValue != null ? Number(result[0].vValue) : 0;
  return parseFloat(load.toFixed(2));
};

export const permeateValue = async (): Promise<number> => {
  const load1 = await loadMembrane1();
  const load2 = await loadMembrane2();
  const totalLoad = load1 + load2;
  return parseFloat(totalLoad.toFixed(2));
};

export const totalLoadWTP = async (): Promise<{
  formula: number;
  totalLoadPercent: number;
  totalPC: number;
}> => {
  const perme = await permeateValue();
  const concent = await concentrateValue();
  const totalPC = perme + concent;
  const formula = perme / (perme + concent);
  const totalLoadPercent = parseFloat(formula.toFixed(2));

  return { formula, totalLoadPercent, totalPC };
};

export const getSummaryStatus = (
  trendData: { info: IDataTrend; data: QueryResult[] }[]
): "Good" | "Not Good" => {
  for (const trend of trendData) {
    const maxValue = Math.max(...trend.data.map((item) => item.Value || 0));
    const stdMax = trend.info.attributes.std_max;
    const stdMin = trend.info.attributes.std_min;

    if ((stdMax && maxValue > stdMax) || (stdMin && maxValue < stdMin)) {
      return "Not Good";
    }
  }
  return "Good";
};

//Load Boiler
const queryBoiler = () => {
  return `DECLARE @TempTable TABLE(Seq INT IDENTITY, tempTagName NVARCHAR(256)) 
INSERT @TempTable(tempTagName) VALUES ('86_steam_flowrate_boiler_12tph ')
SELECT v_Live.TagName, DateTime, vValue, MinRaw = ISNULL(Cast(AnalogTag.MinRaw as VarChar(20)),'N/A'), MaxRaw = ISNULL(Cast(AnalogTag.MaxRaw as VarChar(20)),'N/A')
 FROM v_Live
LEFT JOIN @TempTable ON TagName = tempTagName
LEFT JOIN AnalogTag ON AnalogTag.TagName =v_Live.TagName
 WHERE v_Live.TagName IN ('86_steam_flowrate_boiler_12tph')
ORDER BY Seq`;
};

export const loadBoiler = async (): Promise<number> => {
  const query = queryBoiler();
  const result = (await getHistorianData({ query })) as {
    vValue: number | string | null | undefined;
  }[];
  const value =
    result.length && result[0].vValue != null ? Number(result[0].vValue) : 0;

  return parseFloat(value.toFixed(2));
};

export const loadBoilerPercent = async (): Promise<number> => {
  const query = queryBoiler();
  const result = (await getHistorianData({ query })) as { vValue: number }[];
  const load = result.length ? result[0].vValue : 0;
  const maxLoad = 12000;
  const loadPercentage = (load / maxLoad) * 100;
  return parseFloat(loadPercentage.toFixed(2));
};

const queryRHboiler = () => {
  return `SELECT rh_boiler_12tph
FROM 86_boiler_12tph
ORDER BY tanggal_cek DESC
LIMIT 1`;
};

export const RHboiler = async (): Promise<number | null> => {
  try {
    const query = queryRHboiler();
    const data = await getDynamicForm<{ rh_boiler_12tph: number }>({ query });

    if (data.length > 0) {
      return data[0].rh_boiler_12tph;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

interface RHBoilerData { tanggal_cek: string; pemakaian_rh_boiler_12tph: number; }

const queryRHboilerPeriod = (startDate: string, endDate: string) => {
  return `SELECT tanggal_cek, pemakaian_rh_boiler_12tph
FROM 86_boiler_12tph
WHERE tanggal_cek BETWEEN '${startDate}' AND '${endDate}'
ORDER BY tanggal_cek ASC;`;
};

const RumusLoadPeriod = (data: RHBoilerData[]): number => {
  let totalRunningHours = 0;

  for (let i = 1; i < data.length; i++) {
    const previousEntry = data[i - 1];
    const currentEntry = data[i];
    const deltaValue = currentEntry.pemakaian_rh_boiler_12tph - previousEntry.pemakaian_rh_boiler_12tph;

    if (deltaValue > 0) {
      totalRunningHours += 1;
    }
  }
  return totalRunningHours;
};

export const getRHBoilerPeriod = async (
  startDate: string,
  endDate: string
): Promise<number> => {
  try {
    const query = queryRHboilerPeriod(startDate, endDate);
    const result = await getDynamicForm<RHBoilerData>({ query });

    if (result.length === 0) {
      return 0;
    }
    return RumusLoadPeriod(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    return 0;
  }
};

//DownTime Data
export const DowntimeData = async (year: string, machineName: string) => {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  const areaSection = "UTILITY";
  const baseUrl =
    process.env.NEXT_PUBLIC_API_DOWNTIME || "http://localhost:3008";
  const apiUrl = `${baseUrl}/api/machine-monitoring/downtime?start_date=${startDate}&end_date=${endDate}&area_section=${areaSection}`;

  console.log(apiUrl);
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const result = await response.json();

    // Filter data untuk Sukabumi dan mesin tertentu
    const filteredData = result.data.filter(
      (item: any) =>
        item["MACHINE-Mesin"] === machineName &&
        item.PLANT.toLowerCase() === "sukabumi"
    );

    // Kelompokkan downtime per bulan
    const downtimeByMonth = Array(12).fill(0);
    filteredData.forEach((item: any) => {
      const month = new Date(item["GSTRP-BasicStartDate"]).getMonth();
      downtimeByMonth[month] += item.Downtime;
    });

    return downtimeByMonth;
  } catch (error: any) {
    console.error("Error fetching data:", error);
    throw new Error(error.message);
  }
};

//Trend Machine
const queryTrend = (
  tagName: string,
  startDate: string,
  endDate: string,
  multiplier: number
) => {
  const setRev =
    multiplier === 1
      ? "cyclic"
      : multiplier === 24 || multiplier === 24 * 30
      ? "Max"
      : "cyclic";
  return `SET NOCOUNT ON
DECLARE @StartDate DateTime
DECLARE @EndDate DateTime
SET @StartDate = '${startDate}'
SET @EndDate = '${endDate}'
SET NOCOUNT OFF
SELECT DateTime = convert(nvarchar, DateTime, 21) ,Value ,AnalogTag.TagName, Unit = ISNULL(Cast(EngineeringUnit.Unit as nVarChar(20)),'N/A') From (
SELECT  * 
  FROM [Runtime].[dbo].[History]
  WHERE History.TagName IN ('${tagName}')
  AND wwRetrievalMode = '${setRev}'
  AND wwResolution = 3600000 * ${multiplier}
  AND wwQualityRule = 'Extended'
  AND wwVersion = 'Latest'
  AND DateTime >= @StartDate
  AND DateTime <= @EndDate) temp
LEFT JOIN [Runtime].[dbo].[AnalogTag] ON AnalogTag.TagName =temp.TagName
LEFT JOIN [Runtime].[dbo].[EngineeringUnit] ON AnalogTag.EUKey = EngineeringUnit.EUKey
WHERE temp.StartDateTime >= @StartDate
AND Value IS NOT NULL
ORDER BY [DateTime] ASC;`;
};

interface QueryResult {
  DateTime: string;
  Value: number | null;
  TagName: string;
  unit: string;
}

const getPerMonth = async (tagName: string, year: string, month: string) => {
  const daysInMonth = moment(`${year}-${month}-01`).daysInMonth();
  const startDate = `${year}-${month}-01 00:00:00`;
  const endDate = moment(`${year}-${month}-01`)
    .add(daysInMonth - 1, "days")
    .endOf("day")
    .format("YYYY-MM-DD HH:mm:ss");

  const result = await getHistorianData({
    query: queryTrend(tagName, startDate, endDate, 24),
  });
  return result as QueryResult[];
};

const getMaxValuePerMonth = (data: QueryResult[]): QueryResult[] => {
  const monthlyData: { [key: string]: QueryResult } = {};

  data.forEach((item) => {
    const month = moment(item.DateTime).format("YYYY-MM");
    if (
      !monthlyData[month] ||
      (item.Value !== null && item.Value > (monthlyData[month].Value || 0))
    ) {
      monthlyData[month] = item;
    }
  });

  return Object.values(monthlyData);
};

export const getTrendData = async (
  dataTrend: IDataTrend[],
  searchParams: IModeSearchParams
) => {
  if (searchParams.mode === "monthly") {
    const mapped = await Promise.all(
      dataTrend.map(async (item) => {
        const result: QueryResult[] = [];

        for (let i = 1; i <= 12; i++) {
          const month = i < 10 ? `0${i}` : `${i}`;
          const data = await getPerMonth(
            item.attributes.aveva_tag,
            searchParams.year!,
            month
          );
          result.push(...data);
        }
        const maxMonthlyData = getMaxValuePerMonth(result);
        return {
          info: item,
          data: maxMonthlyData,
        };
      })
    );
    return mapped;
  }

  let multiplier = 1;
  let startDate = searchParams.date! + " 00:00:00";
  let endDate = searchParams.date! + " 23:00:00";

  if (searchParams.mode === "daily") {
    multiplier = 24;
    startDate = `${searchParams.year!}-${searchParams.month!}-01` + " 00:00:00";
    endDate = moment(startDate).endOf("month").format("YYYY-MM-DD HH:mm:ss");
  }

  if (searchParams.mode === "monthly") {
    multiplier = 24 * 30;
    startDate = `${searchParams.year!}-01-01` + " 00:00:00";
    endDate = `${searchParams.year!}-12-31` + " 23:00:00";
  }

  const mapped = await Promise.all(
    dataTrend.map(async (item) => {
      const result = await getHistorianData({
        query: queryTrend(
          item.attributes.aveva_tag,
          startDate,
          endDate,
          multiplier
        ),
      });
      return {
        info: item,
        data: result as QueryResult[],
      };
    })
  );
  return mapped;
};
