
enum QuestionType {
    SCALE = "scale",
    FILL = "fill",
    MULTIPLE = "multiple",
    FILL_PARA = "fillPara"
}

export interface Question {
    qOrder: number,
    qDesc: string,
    qOpts?: any,
    qType: QuestionType
}

export interface Survey {
    sTitle: string,
    sId: string,
    sInst: string,
    sContent: Question[]
}

export interface Assessment {
    title: string,
    id: string,
    desc: string,
    pictures: string[],
    videos: string[],
    surveys: Survey[]
}

export const allSurveys: Survey[] = [
    {
        sTitle: "Karolinska Sleepiness Scale",
        sId: "survey_a",
        sInst:
            "This is a sample instruction for researchers to ask patients to follow when performing this survey.",
        sContent: [
            {
                qOrder: 1,
                qDesc:
                    "On a scale of 1 (extremely alert) to 10 (extremely sleepy), rate your sleepiness: .",
                qType: QuestionType.SCALE,
                qOpts: { "max": 10, "min": 1 }
            }, 
            {
                qOrder: 2,
                qDesc:
                    "please fill out the following _____ .",
                qType: QuestionType.FILL,
                qOpts: {}
            },
            {
                qOrder: 3,
                qDesc:
                    "Tell us something about yourself.",
                qType: QuestionType.FILL_PARA,
                qOpts: {}
            }
        ]
    },
    {
        sTitle: "Vigilance Pong Scoresheet",
        sId: "survey_b",
        sInst:
            "This is a sample instruction for researchers to ask patients to follow when performing this survey.",
        sContent: [
            {
                qOrder: 1,
                qDesc:
                    "In 30 seconds, how many total throws were made?  (can be unknown,otherwise must be non-negative integer)",
                qType: QuestionType.FILL
            },
            {
                qOrder: 2,
                qDesc:
                    "In 30 seconds, how many successful throws were made?  (must be non-negative integer)",
                qType: QuestionType.FILL
            }
        ]
    },
    {
        sTitle: "Task-Switching Paradigm",
        sId: "survey_c",
        sInst:
            "This is a sample instruction for researchers to ask patients to follow when performing this survey.",
        sContent: [
            {
                qOrder: 1,
                qDesc:
                    "Time taken to complete single task exercise: (must be provided either in seconds orin MM:SS format)",
                qType: QuestionType.FILL
            },
            {
                qOrder: 2,
                qDesc:
                    "Number of incorrect answers in single task exercise: (must be non-negative integer)",
                qType: QuestionType.FILL
            },
            {
                qOrder: 3,
                qDesc:
                    "Time taken to complete task switching exercise: ________ (must be provide either in seconds or in MM:SS format)",
                qType: QuestionType.FILL
            },
            {
                qOrder: 4,
                qDesc:
                    "Number of incorrect answers in task switching exercise: _______ (must be nonnegative integer)",
                qType: QuestionType.FILL
            }
        ]
    }
];

export const allAssessments = [
    {
        title: "Selfie Rating",
        id: "type_a",
        desc:
            "In this session, participants will take a selfie of themselves and rate how tired they are on the Karolinska scale",
        pictures: ["Selfie Photo"],
        videos: [],
        surveys: [allSurveys[0]]
    },
    {
        title: "Vigilance Pong",
        id: "type_b",
        desc:
            "Pong is a motor control task that can be quantitatively scored to assess performance.",
        pictures: [],
        videos: ["Video of participant playing pong"],
        surveys: [allSurveys[0], allSurveys[1]]
    },
    {
        title: "Task-Switching Paradigm",
        id: "type_c",
        desc:
            "Task-switching is a cognitive task that requires shifting focus depending on the task at hand. Thus, comparing the speed and accuracy at a single task vs. shifting between multiple tasks assesses higher cognitive functions",
        pictures: ["sefile 1", "sefile 2", "sefile 3"],
        videos: ["Video of participant performing task switch paradigm game"],
        surveys: [allSurveys[2]]
    }
];