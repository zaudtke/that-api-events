export default function dateForge(date) {
  let result;

  if (typeof date === 'object') {
    // either Date or Timestamp
    if (date.toDate) {
      // Firestore Timestamp type
      result = date.toDate();
    } else if (date.getTime()) {
      // JS Date type
      result = date;
    }
  } else if (typeof date === 'string') {
    result = new Date(date);
  }

  return result;
}
