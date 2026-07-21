

export type InvitationData<UserType, T> = T & {
  id: string;
  role: string;
  email: string;
  user: UserData<UserType>;
};


/**
 * Represents a user's access to a shared resource.
 *
 * @property is_explicit - When false, indicates inherited/implicit access that cannot be removed directly.
 * @property can_delete - When false, prevents deletion of this access (e.g., last remaining access, current user).
 */
export type AccessData<UserType, T> = T & {
  id: string;
  role: string;
  user: UserData<UserType>;
  is_explicit?: boolean;
  can_delete?: boolean;
};


export type UserData<T> = T & {
    id: string;
    full_name: string;
    email: string;
};






