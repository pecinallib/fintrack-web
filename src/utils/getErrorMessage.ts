export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && 'response' in err) {
    const axiosErr = err as { response?: { data?: { error?: string } } };
    return axiosErr.response?.data?.error || fallback;
  }

  return fallback;
}
