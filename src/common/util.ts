export class Utility {
  public static mapToString(map: Map<string, string>): string {
    let str = "";
    for (const [key, value] of map) {
      str += `${key}:${value},`;
    }
    return str;
  }

  public static stringToMap(str: string): Map<string, string> {
    const map = new Map<string, string>();
    const arr = str.split(",");
    for (const item of arr) {
      const [key, value] = item.split(":");
      map.set(key, value);
    }
    return map;
  }
}
