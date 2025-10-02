import { ModeToggle } from "@/components/mode-toggle";
import RegisterForm from "@/app/(auth)/register/register-form";

const RegisterPage = () => {
  console.log(
    "process.env.NEXT_PUBLIC_API_ENDPOINT",
    process.env.NEXT_PUBLIC_API_ENDPOINT
  );

  return (
    <div>
      <ModeToggle />
      <h1 className="text-xl font-semibold text-center">Register page</h1>
      <div className="flex justify-center">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
