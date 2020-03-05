

export interface SurveyTemplate {
    id: number;
    name: string;
    inst: string;
    isArchived: boolean;
    questions: SurveyQuestion[];
}

export enum QuestionType {
    FILL = 1,
    FILL_TIME = 2,
    MULTIPLE_CHOICE = 3,
    SCALE = 4,
    LARGE_TEXT = 5
}


export interface SurveyQuestion {
    number: number;
    type: QuestionType;
    statement: string;
    meta: any; // the field to store SCALE max/min, MULTIPLE_CHOICE options
}