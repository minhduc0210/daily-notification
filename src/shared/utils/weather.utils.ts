export class WeatherTransformer {
  static toCelsius(fahrenheit: number): number {
    return Math.round((fahrenheit - 32) / 1.8);
  }

  static formatUnixTime(unixTime: number, timezoneOffset: number): string {
    const date = new Date((unixTime + timezoneOffset) * 1000);
    return (
      date.getUTCHours().toString().padStart(2, '0') +
      ':' +
      date.getUTCMinutes().toString().padStart(2, '0')
    );
  }
}
