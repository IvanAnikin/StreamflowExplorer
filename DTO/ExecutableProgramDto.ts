import { ProgramDto } from "./ProgramDto"

export interface ExecutableProgramDto extends ProgramDto {
    isFork: boolean
}