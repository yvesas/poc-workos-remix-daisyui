import {
  useLoaderData,
  Form,
  useActionData,
  useNavigation,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router";
import { z } from "zod";
import { json, redirect } from "~/utils/responses";
import type { User } from "~/types";
import { useState, useEffect } from "react";
import { useProfileStore } from "~/stores/profileStore";
import { authkitLoader } from "@workos-inc/authkit-remix";

type LoaderData = {
  user: User;
};

type ActionData = {
  success?: boolean;
  error?: string;
  field?: string;
};

/**
 * Profile page - editable user profile
 * Uses Zustand for state management with optimistic UI updates
 *
 * Benefits of Zustand here:
 * - Optimistic UI: Shows changes immediately before server confirmation
 * - Unsaved changes indicator
 * - Persistent state across navigation
 * - No prop drilling
 */
export async function loader(args: LoaderFunctionArgs): Promise<Response> {
  const data = (await authkitLoader(args as any)) as any;
  const user = data?.user as User | null;
  const signInUrl = data?.signInUrl as string | undefined;
  if (!user) {
    if (signInUrl) return redirect(signInUrl);
    return redirect("/");
  }
  return json<LoaderData>({ user });
}

// Zod Schema for profile validation
const profileSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .optional()
    .or(z.literal("")),
});

export async function action({
  request,
}: ActionFunctionArgs): Promise<Response> {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "updateProfile") {
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    // Zod Validation
    const result = profileSchema.safeParse(data);

    if (!result.success) {
      // Get the first error message
      const firstError = result.error.issues[0]?.message || "Erro de validação";
      return json<ActionData>(
        { error: firstError, field: "profile" },
        { status: 400 }
      );
    }

    // In production, update user in database
    // For now, just return success
    return json<ActionData>({ success: true, field: "profile" });
  }

  if (intent === "changePassword") {
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return json<ActionData>(
        { error: "Todos os campos são obrigatórios", field: "password" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return json<ActionData>(
        { error: "As senhas não coincidem", field: "password" },
        { status: 400 }
      );
    }

    // In production, validate current password and update
    // For now, just return success
    return json<ActionData>({ success: true, field: "password" });
  }

  return json<ActionData>({ error: "Ação inválida" }, { status: 400 });
}

export default function Perfil() {
  const { user: serverUser } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();

  // Zustand store for optimistic UI
  const {
    user: storeUser,
    setUser,
    updateField,
    isDirty,
    setSaving,
  } = useProfileStore();

  // Initialize store with server data
  useEffect(() => {
    setUser(serverUser);
  }, [serverUser, setUser]);

  // Use store user for optimistic UI, fallback to server user
  const user = storeUser || serverUser;

  const [previewUrl, setPreviewUrl] = useState(user.avatarUrl);

  const isSubmitting = navigation.state === "submitting";
  const isProfileSubmitting =
    isSubmitting && navigation.formData?.get("intent") === "updateProfile";
  const isPasswordSubmitting =
    isSubmitting && navigation.formData?.get("intent") === "changePassword";

  // Update saving state
  useEffect(() => {
    setSaving(isProfileSubmitting);
  }, [isProfileSubmitting, setSaving]);

  // Reset dirty flag on successful save
  useEffect(() => {
    if (actionData?.success && actionData?.field === "profile") {
      setUser(user); // This resets isDirty to false
    }
  }, [actionData, user, setUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-base-content/60 mt-1">Profile Settings</p>
      </div>

      {/* Unsaved Changes Indicator - Powered by Zustand */}
      {isDirty && !isProfileSubmitting && (
        <div className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Você tem alterações não salvas</span>
        </div>
      )}

      {/* Profile Information Card */}
      <div className="card bg-base-100 shadow-xl rounded-2xl">
        <div className="card-body">
          <h2 className="card-title">Profile Settings</h2>

          <Form
            method="post"
            encType="multipart/form-data"
            className="space-y-6"
          >
            <input type="hidden" name="intent" value="updateProfile" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label"><span className="label-text">Name</span></label>
                <input type="text" name="firstName" value={user.firstName} onChange={(e) => updateField('firstName', e.target.value)} className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Email Id</span></label>
                <input type="email" name="email" value={user.email} onChange={(e) => updateField('email', e.target.value)} className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Title</span></label>
                <input type="text" name="title" className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Place</span></label>
                <input type="text" name="place" className="input input-bordered" />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text">About</span></label>
                <textarea name="about" className="textarea textarea-bordered" rows={4}></textarea>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Language</span></label>
                <select name="language" className="select select-bordered">
                  <option>English</option>
                  <option>Português</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Timezone</span></label>
                <input type="text" name="timezone" className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Phone</span></label>
                <input type="tel" name="phone" value={user.phone || ''} onChange={(e) => updateField('phone', e.target.value)} className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Sync Data</span></label>
                <input type="checkbox" name="sync" className="toggle toggle-primary" />
              </div>
            </div>

            {/* Email - with Zustand optimistic update */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="input input-bordered"
                required
              />
            </div>

            {/* Phone - New field with Zod validation example */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Telefone</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={user.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
                className="input input-bordered"
                placeholder="(00) 00000-0000"
              />
            </div>

            {/* Success/Error Messages */}
            {actionData?.field === "profile" && (
              <div
                className={`alert ${actionData.success ? "alert-success" : "alert-error"}`}
              >
                <span>
                  {actionData.success
                    ? "Perfil atualizado com sucesso!"
                    : actionData.error}
                </span>
              </div>
            )}

            <div className="card-actions justify-end">
              <button type="submit" className="btn btn-primary" disabled={isProfileSubmitting}>
                {isProfileSubmitting ? (<><span className="loading loading-spinner"></span> Atualizando...</>) : ('Update')}
              </button>
            </div>
          </Form>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Alterar Senha</h2>

          <Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="changePassword" />

            {/* Current Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Senha Atual</span>
              </label>
              <input
                type="password"
                name="currentPassword"
                className="input input-bordered"
                required
              />
            </div>

            {/* New Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Nova Senha</span>
              </label>
              <input
                type="password"
                name="newPassword"
                className="input input-bordered"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Confirmar Nova Senha
                </span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="input input-bordered"
                required
              />
            </div>

            {/* Success/Error Messages */}
            {actionData?.field === "password" && (
              <div
                className={`alert ${actionData.success ? "alert-success" : "alert-error"}`}
              >
                <span>
                  {actionData.success
                    ? "Senha alterada com sucesso!"
                    : actionData.error}
                </span>
              </div>
            )}

            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPasswordSubmitting}
              >
                {isPasswordSubmitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Alterando...
                  </>
                ) : (
                  "Alterar Senha"
                )}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
