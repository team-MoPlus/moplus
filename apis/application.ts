import { AxiosError } from "axios";
import { ApplicationForm } from "../types/result";
import { api, pdfServer } from "./axios";

// 최대 재시도 횟수 설정
// const MAX_RETRIES = 3;

// const notify503 = (retry: number) =>
// 	toast.loading(`접속자가 많습니다. ${retry}번째 재시도 중입니다..`);
// const notifyError = () =>
// 	toast.error("서버가 과부하 상태입니다. 다시 시도해 주세요.");

/**
 *
 * @param testResultId 테스트 결과 Id
 * @param name 사용자가 입력한 이름
 * @param phoneNumber 사용자가 입력한 전화번호
 * @returns post 요청 성공 여부를 리턴합니다.
 */
export const postApplication = async ({
	testResultId,
	name,
	phoneNumber,
}: ApplicationForm) => {
	return await api
		.post(`/detailResultApplication`, {
			testResultId: testResultId,
			name: name,
			phoneNumber: phoneNumber,
		})
		.then((res) => {
			return res.data;
		})
		.catch((err: AxiosError) => {
			console.error(err);
		});
};
