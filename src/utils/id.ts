// Tiny collision-resistant id generator for locally-created tasks. No external
// uuid dependency needed for a front-end-only app — timestamp + random suffix
// is more than enough to keep React keys and store entries unique.
export function makeId(prefix = 'id'): string {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${time}${rand}`;
}

export default makeId;
