

export type InvitationData<UserType, T> = T & {
  id: string;
  role: string;
  email: string;
  user: UserData<UserType>;
};


export type AccessData<UserType, T > = T & {
  id: string;
  role: string;
  user: UserData<UserType>;
  is_explicit?: boolean;
};


export type UserData<T> = T & {
    id: string;
    full_name: string;
    email: string;
};






