export interface ApplicationForm {
	testResultId: number;
	name: string;
	phoneNumber: string;
}

export interface IncorrectProblem {
	problemNumber: string;
	correctRate: number;
}

export interface IEstimatedRank {
	ratingProvider: string;
	estimatedRating: number;
}

export interface IRatingRow {
	rating: number;
	rawScores: string;
	standardScores: number;
	percentiles: number;
}

export interface IRatingTable {
	id: number;
	practiceId: number;
	ratingProvider: string;
	ratingRows: IRatingRow[];
}

export interface TestResult {
	testResultId: number;
	score: number;
	solvingTime: string;
	averageSolvingTime: string;
	estimatedRatingGetResponses: IEstimatedRank[];
	incorrectProblems: IncorrectProblem[];
	ratingTables: IRatingTable[];
}

export interface IRecommendedProblem {
	problemNumber: string;
	difficultLevel: string;
	correctRate: number;
	rating: string;
	imageUrl: string;
}

export interface DetailResultApplication {
	testResultId: number;
	score: number;
	solvingTime: string;
	averageSolvingTime: string;
	estimatedRatingGetResponses: IEstimatedRank[];
	incorrectProblems: IncorrectProblem[];
	forCurrentRating: IRecommendedProblem[];
	forNextRating: IRecommendedProblem[];
	forBeforeRating: IRecommendedProblem[];
}
