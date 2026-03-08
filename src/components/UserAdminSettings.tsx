import { Button, Card, Group, NumberInput, Stack, Switch } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useEffect, useRef } from "react";
import { useUpdateUserAdmin } from "../hooks/useUserMutations";
import { useUser } from "../hooks/useUserQueries";
import { showError } from "../utils/notifications";

interface AdminFormData {
  is_active: boolean;
  is_superuser: boolean;
  has_llm_access: boolean;
  bonus_analyses: number;
}

interface UserAdminSettingsProps {
  userId: number;
}

export function UserAdminSettings({ userId }: UserAdminSettingsProps) {
  const hasInitialized = useRef(false);
  const { data: user, isLoading } = useUser(userId);
  const { updateUser, validateAdminUpdate, currentUserId } =
    useUpdateUserAdmin(userId);

  const form = useForm<AdminFormData>({
    mode: "controlled",
    initialValues: {
      is_active: true,
      is_superuser: false,
      has_llm_access: true,
      bonus_analyses: 1,
    },
    validate: {
      bonus_analyses: (value) =>
        value < 0 ? "Bonus analyses cannot be negative" : null,
    },
  });

  const initializeForm = useCallback(() => {
    if (user && !hasInitialized.current) {
      form.setValues({
        is_active: user.is_active ?? true,
        is_superuser: user.is_superuser ?? false,
        has_llm_access: user.has_llm_access ?? true,
        bonus_analyses: user.bonus_analyses ?? 1,
      });
      hasInitialized.current = true;
    }
  }, [user, form]);

  useEffect(() => {
    initializeForm();
  }, [initializeForm]);

  const handleSubmit = (values: AdminFormData) => {
    const validationError = validateAdminUpdate(values);
    if (validationError) {
      showError("Error", validationError);
      return;
    }
    updateUser.mutate({
      is_active: values.is_active,
      is_superuser: values.is_superuser,
      has_llm_access: values.has_llm_access,
      bonus_analyses: values.bonus_analyses,
    });
  };

  const isSelf = currentUserId === userId;

  if (isLoading) {
    return (
      <Card withBorder>
        <Stack>
          <Switch label="Account active" disabled />
          <Switch label="Admin" disabled />
          <Switch label="LLM access" disabled />
          <NumberInput label="Bonus analyses" disabled />
        </Stack>
      </Card>
    );
  }

  return (
    <Card withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Switch
            label="Account active"
            description="Inactive users cannot log in"
            {...form.getInputProps("is_active", { type: "checkbox" })}
            disabled={isSelf}
          />

          <Switch
            label="Admin"
            description="Grant superuser privileges"
            {...form.getInputProps("is_superuser", { type: "checkbox" })}
            disabled={isSelf}
          />

          <Switch
            label="LLM access"
            description="Allow this user to use LLM-powered features"
            {...form.getInputProps("has_llm_access", { type: "checkbox" })}
          />

          <NumberInput
            label="Current available analyses"
            description="Current analyses available to this user"
            min={0}
            {...form.getInputProps("bonus_analyses")}
          />

          <Group justify="flex-end">
            <Button type="submit" loading={updateUser.isPending}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}
