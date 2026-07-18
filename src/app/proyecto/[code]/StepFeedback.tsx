export default function StepFeedback({
  error,
  guardado,
}: {
  error?: string;
  guardado?: boolean;
}) {
  if (error) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
    );
  }
  if (guardado) {
    return (
      <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
        Guardado.
      </p>
    );
  }
  return null;
}
