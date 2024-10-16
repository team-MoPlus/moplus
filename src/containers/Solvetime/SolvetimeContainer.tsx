"use client";

import { Banner } from "@/components/Banner";
import { HourMinutePicker } from "@/components/Tables";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
	countSolveCount,
	postAnswer,
	postSolveTime,
} from "../../../apis/testResult";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
	incorrectProblemState,
	testInfoState,
	testResultState,
} from "@/recoil/atoms";
import { TestInfo } from "../../../types/Item";
import ModalPortal from "../../../utils/Portal";
import { Modal } from "@/components/Modal";
import SubmitModal from "@/components/Modal/SubmitModal";
import { IoChevronBackOutline } from "react-icons/io5";

const SolvetimeContainer = ({ testId }: { testId: number }) => {
	const [hour, setHour] = useState<string>("");
	const [minute, setMinute] = useState<string>("");
	const router = useRouter();
	const setTestResultInfo = useSetRecoilState(testResultState);
	const testInfo = useRecoilValue<TestInfo>(testInfoState);
	const incorrectProblem = useRecoilValue(incorrectProblemState);
	const [modalOpen, setModalOpen] = useState<boolean>(false);

	// 시간 입력 핸들러
	const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const stringValue = e.target.value;
		if (/^\d{0,1}$/.test(stringValue)) {
			setHour(stringValue);
		}
	};

	// 분 입력 핸들러
	const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const stringValue = e.target.value;
		if (/^\d{0,2}$/.test(stringValue)) {
			setMinute(stringValue);
		}
	};

	const handleSubmit = () => {
		AnswerMutation.mutate({ incorrectProblem });
		countSolveCount(testInfo.id);
		setModalOpen(false);
	};

	const AnswerMutation = useMutation({
		mutationFn: (params: {
			incorrectProblem: { problemNumber: string; incorrectAnswer: string }[];
		}) => postAnswer(testId, params.incorrectProblem),
		onSuccess: (data, variables) => {
			SolveTimeMutation.mutate({
				testResultId: data,
				timeString: `PT${hour}H${minute}M`,
			});
		},
		// 에러 핸들링 (optional)
		onError: (error) => {
			console.error("Error posting data:", error);
			alert("There was an error submitting your answers.");
		},

		// 요청이 완료되면 실행 (성공 또는 실패와 무관)
		onSettled: () => {
			console.log("Request has been processed.");
		},
	});

	const SolveTimeMutation = useMutation({
		mutationFn: (params: { testResultId: number; timeString: string }) =>
			postSolveTime(params.testResultId, params.timeString),
		onSuccess: (data, variables) => {
			console.log(variables.testResultId, variables.timeString);
			console.log(data);
			setTestResultInfo(data);
			router.push(`/result/${data.id}/${0}`);
		},
		// 에러 핸들링 (optional)
		onError: (error) => {
			console.error("Error posting data:", error);
			alert("There was an error submitting your solved time.");
		},

		// 요청이 완료되면 실행 (성공 또는 실패와 무관)
		onSettled: () => {
			console.log("Request has been processed.");
		},
	});

	return (
		<div className="p-4">
			<div className="flex gap-2">
				<IoChevronBackOutline
					size={36}
					className="cursor-pointer"
					onClick={() => router.back()}
				/>
				<Link href="/" className="inline-block">
					<Banner />
				</Link>
			</div>
			<div className="h-16 text-white px-6 my-2 text-xl font-bold bg-orange-500 rounded-lg flex items-center">
				풀이 시간을 입력해주세요!
			</div>
			<div className="w-full h-96 flex gap-2 justify-center items-center">
				<input
					type="number"
					pattern="\d*"
					value={hour}
					onChange={handleHourChange}
					className="rounded-lg w-12 h-12 border border-orange-500 text-orange-500 text-2xl text-center focus:outline-none"
				/>
				<div className="text-xl mr-4">시간</div>
				<input
					type="number"
					pattern="\d*"
					value={minute}
					onChange={handleMinuteChange}
					className="rounded-lg w-12 h-12 border border-orange-500 text-orange-500 text-2xl text-center focus:outline-none"
				/>
				<div className="text-xl">분</div>
				{/* <HourMinutePicker /> */}
			</div>
			<div className="flex justify-center">
				<button
					className="w-64 h-12 bg-orange-200 text-orange-500 rounded-lg disabled:bg-gray-200 disabled:text-gray-400"
					disabled={hour.length === 0 || minute.length === 0}
					onClick={() => setModalOpen(true)}
				>
					입력 완료
				</button>
			</div>
			{modalOpen && (
				<ModalPortal>
					<SubmitModal
						onClose={() => setModalOpen(false)}
						onClick={handleSubmit}
					/>
				</ModalPortal>
			)}
		</div>
	);
};

export default SolvetimeContainer;
