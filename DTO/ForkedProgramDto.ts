import { ProgramDto } from "./ProgramDto" 

export interface ForkedProgramDto extends ProgramDto{
    ownerId: string,
    isFork: boolean,
}