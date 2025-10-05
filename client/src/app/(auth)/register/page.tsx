import { ModeToggle } from "@/components/mode-toggle";
import RegisterForm from "@/app/(auth)/register/register-form";

const RegisterPage = () => {
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
