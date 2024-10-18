export class RegexUtils {
  static findFirstMatch(text: string, regex: RegExp): string {
    const matches = text.match(regex);
    return matches && matches.length ? matches[0] : '';
  }

  static findSecondMatch(text: string, regex: RegExp): string {
    let match: RegExpExecArray;
    let matchCount = 0;
    let result = '';
    const targetMatchNumber = 2;
    while ((match = regex.exec(text)) !== null) {
      matchCount++;
      if (matchCount === targetMatchNumber) {
        result = match[0];
        break;
      }
    }
    return result;
  }

  static findThirdMatch(text: string, regex: RegExp): string {
    let match: RegExpExecArray;
    let matchCount = 0;
    let result = '';
    const targetMatchNumber = 3;
    while ((match = regex.exec(text)) !== null) {
      matchCount++;
      if (matchCount === targetMatchNumber) {
        result = match[0];
        break;
      }
    }
    return result;
  }
}
