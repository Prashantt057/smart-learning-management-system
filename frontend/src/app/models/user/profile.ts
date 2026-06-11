export interface Profile {
  id?: string;

  userId: string;

  phone: string;

  location: string;

  experienceLevel: string;

  skills: string[];

  learningPreferences: {
    emailNotifications: boolean;

    darkMode: boolean;
  };
}
