import { Button, Card, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useEffect, useRef } from "react";
import { useUpdateUserProfile } from "../hooks/useUserMutations";
import { useUser } from "../hooks/useUserQueries";
import { showError } from "../utils/notifications";
import { validateEmail } from "../utils/validation";

interface ProfileFormData {
  full_name: string;
  email: string;
}

interface UserProfileSettingsProps {
  userId: number;
}

// TODO: Merge with ProfileSettings
export function UserProfileSettings({ userId }: UserProfileSettingsProps) {
  const hasInitialized = useRef(false);
  const { data: user, isLoading } = useUser(userId);
  const { updateProfile } = useUpdateUserProfile(userId);

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    mode: "uncontrolled",
    initialValues: {
      full_name: "",
      email: "",
    },
    validate: {
      email: (value) => {
        if (!value.trim()) return null; // Optional field
        return validateEmail(value);
      },
    },
  });

  // Initialize profile form with user data
  const initializeProfileForm = useCallback(() => {
    if (user && !hasInitialized.current) {
      profileForm.setValues({
        full_name: user.full_name || "",
        email: user.email || "",
      });
      hasInitialized.current = true;
    }
  }, [user, profileForm]);

  // Pre-populate profile form when user data is available (only once)
  useEffect(() => {
    initializeProfileForm();
  }, [initializeProfileForm]);

  const handleUpdateProfile = (values: ProfileFormData) => {
    if (!values.full_name.trim() && !values.email.trim()) {
      showError("Profile update failed", "At least one field must be provided");
      return;
    }
    updateProfile.mutate({
      full_name: values.full_name || null,
      email: values.email || null,
    });
  };

  if (isLoading) {
    return (
      <Card withBorder>
        <Stack>
          <TextInput label="Full Name" placeholder="Loading..." disabled />
          <TextInput label="Email" placeholder="Loading..." disabled />
        </Stack>
      </Card>
    );
  }

  return (
    <Card withBorder>
      <form onSubmit={profileForm.onSubmit(handleUpdateProfile)}>
        <Stack>
          <TextInput
            label="Full Name"
            placeholder="Enter full name"
            key={profileForm.key("full_name")}
            {...profileForm.getInputProps("full_name")}
          />
          <TextInput
            label="Email"
            type="email"
            placeholder="Enter email"
            key={profileForm.key("email")}
            {...profileForm.getInputProps("email")}
          />
          <Group justify="flex-end">
            <Button type="submit" loading={updateProfile.isPending}>
              Update Profile
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}
