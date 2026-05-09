export type ProfileRole = "mother" | "child";
export type TaskStatus = "pending" | "completed";

export type Profile = {
  id: string;
  role: ProfileRole;
  family_id: string;
  name: string;
  coins: number;
};

export type Task = {
  id: string;
  family_id: string;
  title: string;
  details: string | null;
  assignee_id: string;
  deadline: string;
  status: TaskStatus;
};

export type Reward = {
  id: string;
  family_id: string;
  title: string;
  cost: number;
};
