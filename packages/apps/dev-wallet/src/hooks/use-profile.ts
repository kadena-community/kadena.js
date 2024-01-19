import { useLocalStorage } from 'usehooks-ts';

const KADENA_PROFILE = 'kadena_profile';

export function useProfile() {
  const [profiles, setProfiles] = useLocalStorage<string[]>(KADENA_PROFILE, []);
  return [
    profiles,
    (profile: string) => {
      if (profiles.includes(profile)) {
        return;
      }
      if (profile.length < 3) {
        throw new Error('Profile name must be at least 3 characters long');
      }
      setProfiles([...profiles, profile]);
    },
  ] as const;
}
