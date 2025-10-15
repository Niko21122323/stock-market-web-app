"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import { signInWithEmail } from "@/lib/actions/auth.actions";

const SignIn = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signInWithEmail(data);
      if (result.success) router.push("/");
    } catch (e) {
      console.error(e);
      toast.error("Sign in failed", {
        description: e instanceof Error ? e.message : "Failed to sign in.",
      });
    }
  };

  return (
    <>
      <h1 className="pb-10 text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">
        Welcome back!
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <InputField
            name="email"
            label="Email"
            placeholder="john@doe.com"
            register={register}
            error={errors.email}
            validation={{
              required: "Email is required",
              pattern: /^\w+@\w+\.\w+$/,
            }}
          />
          <InputField
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            register={register}
            error={errors.password}
            validation={{ required: "Password is required", minLength: 8 }}
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-5 px-4 py-6 relative overflow-hidden text-xl font-semibold hover:text-foreground transition-colors duration-300 ease-in-out cursor-pointer group"
          variant={"default"}
        >
          <span className="relative z-10">
            {isSubmitting ? "Signing In" : "Sign In"}
          </span>
          <div className="absolute bottom-0 left-0 w-full h-full bg-primary group-hover:h-0 transition-all duration-300 ease-in-out"></div>
        </Button>
        <FooterLink
          text="Don't have an account?"
          linkText="Create an account"
          href="/sign-up"
        />
      </form>
    </>
  );
};
export default SignIn;
