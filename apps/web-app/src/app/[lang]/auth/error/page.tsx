import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function NewPasswordPage() {
  return (
    <div className="grid gap-2 text-center">
      <div className="flex w-full items-center justify-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </div>
  );
}
