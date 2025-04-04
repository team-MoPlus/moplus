"use client";

import React, { useEffect, useState } from "react";
import { TestInfo } from "../../../types/Item";
import { usePathname, useRouter } from "next/navigation";
import { useRecoilState, useRecoilValue } from "recoil";
import {
	ratingTablesState,
	testInfoState,
	testResultState,
} from "@/recoil/atoms";
import { TestResult } from "../../../types/result";
import { useQuery } from "@tanstack/react-query";
import { getTestResultInfoById } from "../../../apis/testResult";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getTestById } from "../../../apis/tests";
import { DropdownMenu } from "@/components/Dropdowns";

const ResultSharingContainer = ({
	testResultId,
	testId,
}: {
	testResultId: number;
	testId: number;
}) => {
	const router = useRouter();
	const [timeArr, setTimeArr] = useState<string[]>([]);
	const [testResultInfo, setTestResultInfo] =
		useRecoilState<TestResult>(testResultState);
	const [testInfo, setTestInfo] = useRecoilState<TestInfo>(testInfoState);
	const [curRankProvider, setCurRankProvider] = useState("");
	const [ratingTables, setRatingTables] = useRecoilState(ratingTablesState);

	useEffect(() => {
		const userAgent = navigator.userAgent.toLowerCase();
		const currentUrl = window.location.href;

		if (userAgent.includes("kakaotalk")) {
			// 카카오톡 인앱 브라우저 감지 시 리디렉션
			window.location.href =
				"kakaotalk://web/openExternal?url=" + encodeURIComponent(currentUrl);
		}
	}, []);

	const handleTestResult = async (data: TestResult) => {
		await setTestResultInfo(data);
		setTimeArr([
			data.solvingTime.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)?.[1] || "0",
			data.solvingTime.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)?.[2] || "0",
		]);

		setCurRankProvider(testResultInfo.ratingTables[0].ratingProvider);
	};

	const {
		data: TestResultData,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: ["resultinfobyid", testResultId],
		queryFn: () => getTestResultInfoById(testResultId),
		select: React.useCallback((data: TestResult) => handleTestResult(data), []),
	});

	const {
		data: TestData,
		isPending: TestDataisPending,
		isError: TestDataisError,
		error: TestDataerror,
	} = useQuery({
		queryKey: ["testinfobyid", testId],
		queryFn: () => getTestById(testId),
		select: React.useCallback((data: TestInfo) => setTestInfo(data), []),
	});

	if (isPending || testResultInfo === undefined) {
		return <LoadingSpinner />;
	} else if (TestDataisPending) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return <p>Error: {error.message}</p>;
	} else if (TestDataisError) {
		return <p>Error: {TestDataerror.message}</p>;
	}

	return (
		<div className="p-4">
			{/* 결과 */}
			<div className="h-16 text-white px-6 my-2 text-xl font-bold bg-orange-600 rounded-lg flex items-center">
				결과
			</div>
			<div className="p-4 w-full border border-dashed border-orange-200 rounded-md">
				<h1 className="text-xl">
					[{testInfo.subject}] {testInfo.name}({testInfo.provider})
				</h1>
				<div className="py-8 flex w-full justify-around items-center">
					<div className="text-5xl text-orange-500">
						{testResultInfo.score}
						<span className="text-gray-500">점</span>
					</div>
					<div className="text-3xl text-gray-400">
						<span className="text-orange-500">{timeArr[0]}</span>h{" "}
						<span className="text-orange-500">{timeArr[1]}</span>
						m
						<br />
						<div className="text-sm flex justify-end">내 풀이 시간</div>
					</div>
				</div>
			</div>
			{/* 틀린 문제 */}
			<div className="p-4 w-full border border-dashed border-orange-200 rounded-md my-2">
				<h1 className="text-xl mb-4">틀린 문제 정답률</h1>
				<div className="grid grid-cols-4 items-center gap-2 text-gray-600">
					{testResultInfo.incorrectProblems.map((problem, idx) => (
						<div key={idx} className="flex items-center text-sm">
							{problem.problemNumber}번{" "}
							<span className="inline-block ml-1 text-xs text-orange-500 border border-orange-500 rounded-md px-[2px]">
								{problem.correctRate}%
							</span>
						</div>
					))}
				</div>
			</div>
			{/* 예상 등급 */}
			<div className="w-full border border-dashed border-orange-200 rounded-md p-4">
				<div className="flex gap-4 items-center mb-4">
					<h1 className="text-xl">예상 등급</h1>
					<DropdownMenu
						defaultText={"대성마이맥"}
						ItemObj={Object.fromEntries(
							(testResultInfo.ratingTables || []).map((table) => [
								table.ratingProvider,
								[],
							])
						)}
						buttonWidth={"w-30"}
						setData={setCurRankProvider}
					/>
				</div>
				<div className="w-full flex justify-between mb-4">
					<div className="text-4xl text-orange-500">
						{
							testResultInfo.estimatedRatingGetResponses.find(
								(obj) => obj.ratingProvider === curRankProvider
							)?.estimatedRating
						}
						<span className="text-gray-500">등급</span>
					</div>
				</div>
				<div className="w-full">
					<div className="w-full flex text-center py-1 h-10 items-center text-md bg-orange-500 text-white">
						<div className="w-2/12 border-r-2 border-white">등급</div>
						<div className="w-4/12 border-r-2 border-white">원점수</div>
						<div className="w-3/12 border-r-2 border-white">표준점수</div>
						<div className="w-3/12">백분위</div>
					</div>
					{(
						testResultInfo.ratingTables.find(
							(table) => table.ratingProvider === curRankProvider
						)?.ratingRows || []
					)
						?.slice(0, 8)
						.map((v, i) => (
							<div
								key={i}
								className={`h-12 flex text-center items-center py-1 border-b-2 border-gray-200 ${
									i + 1 ==
									testResultInfo.estimatedRatingGetResponses.find(
										(obj) => obj.ratingProvider === curRankProvider
									)?.estimatedRating
										? "bg-orange-200 text-lg"
										: "text-md text-gray-500"
								}`}
							>
								<div className="w-2/12">{v["rating"]}</div>
								<div className="w-4/12">{v["rawScores"]}</div>
								<div className="w-3/12">{v["standardScores"]}</div>
								<div className="w-3/12">{v["percentiles"]}</div>
							</div>
						))}
				</div>
			</div>

			<div className="flex justify-between">
				<button
					className="w-full h-12 mt-4 bg-orange-500 text-white rounded-lg text-sm"
					onClick={() => router.replace("/searchmo")}
				>
					나도 분석해보기
				</button>
			</div>
		</div>
	);
};

export default ResultSharingContainer;
