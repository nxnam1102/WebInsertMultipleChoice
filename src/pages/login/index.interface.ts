import { ReduxStateBase } from "../../interface/redux";

export interface Props {}
export interface LogInState extends ReduxStateBase {
    succeed ?: boolean;
    error ?: boolean;
    username?: string;
    password?: string;
}