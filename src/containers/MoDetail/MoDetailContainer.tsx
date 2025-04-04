"use client";

import { getSubjectDict } from "../../../utils/getSubjectDict";
import Link from "next/link";
import { Banner } from "@/components/Banner";
import { getTestById } from "../../../apis/tests";
import { useQuery } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import { testInfoState } from "@/recoil/atoms";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { IoChevronBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MoDetailContainer = ({ id }: { id: number }) => {
	const [testInfo, setTestInfo] = useRecoilState(testInfoState);
	const subjectDict = getSubjectDict();
	const router = useRouter();

	const { data, isPending, isError, error } = useQuery({
		queryKey: ["tests", id],
		queryFn: () => getTestById(id),
	});

	useEffect(() => {
		if (data) {
			setTestInfo(data);
		}
	}, [data, setTestInfo]);
	

	if (isPending) {
		return <LoadingSpinner />;
	}

	// 에러가 발생했을 때 표시할 UI
	if (isError) {
		return <p>Error: {error.message}</p>;
	}

	return (
		<div className="w-full h-full items-center flex-col p-4">
			<div className="h-16 text-white text-xl font-bold bg-orange-500 rounded-lg flex justify-between items-center my-2">
				<IoChevronBackOutline
					size={36}
					className="cursor-pointer flex items-center relative left-2"
					onClick={() => router.back()}
				/>
				<h1 className="text-center flex-1">선택하신 모의고사가 맞나요?</h1>
				<div className="w-6"></div>
			</div>
			<div className="mt-8">
				<p className="text-xl text-orange-500">선택한 모의고사</p>
				<p className="text-md">{testInfo.name}</p>
			</div>

			{Object.keys(subjectDict).includes(testInfo.subject) ? (
				<>
					<div>
						<p className="text-xl text-orange-500 mt-8">과목</p>
						<p className="text-lg">{subjectDict[testInfo.subject]}</p>
					</div>
					<div>
						<p className="text-xl text-orange-500 mt-8">선택 과목</p>
						<div className="grid grid-cols-3 gap-x-6 gap-y-4 mt-2 px-4">
							{Object.entries(subjectDict)
								.filter(
									([key, value]) => value === subjectDict[testInfo.subject]
								)
								.map(([key, value], idx) => (
									<div
										key={key}
										className={`flex justify-center items-center h-12 border rounded-xl text-md ${key === testInfo.subject ? "text-orange-500 border-orange-500" : "text-gray-300 border-gray-200"}`}
									>
										{key}
									</div>
								))}
						</div>
					</div>
				</>
			) : (
				<>
					<div>
						<p className="text-xl text-orange-500 mt-8">과목</p>
						<p className="pl-2 text-xl">{testInfo.subject}</p>
					</div>
				</>
			)}
			<Link
				href={`/answer/${id}`}
				className="flex w-64 h-12 justify-center mt-20 pb-4 mx-auto"
			>
				<button className="w-full h-12 bg-orange-200 text-orange-500 rounded-lg">
					선택 완료
				</button>
			</Link>
		</div>
	);
};

export default MoDetailContainer;
