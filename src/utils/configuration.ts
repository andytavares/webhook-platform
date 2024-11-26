export class Config {
  public static getString(key: string): string {
    if (!process.env[key])
      throw new SyntaxError(
        `The key ${key} was not found, are you sure it's configured in the .env file?`
      );
    return process.env[key] as string;
  }
}
