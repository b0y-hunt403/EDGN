export interface MockApiOptions {
  delay?: number;
  fail?: boolean;
  errorMessage?: string;
}

function cloneData<T>(data: T): T {
  return structuredClone(data);
}

export async function mockApi<T>(
  data: T,
  options: MockApiOptions = {},
): Promise<T> {
  const delay = options.delay ?? 420;
  await new Promise((resolve) => window.setTimeout(resolve, delay));

  if (options.fail) {
    throw new Error(options.errorMessage ?? "The demo service is unavailable.");
  }

  return cloneData(data);
}

export async function mockMutation<T>(
  result: T,
  delay = 520,
): Promise<T> {
  return mockApi(result, { delay });
}
