const mapping: Record<string, string> = {
  organizations: 'organization',
  parents: 'parent',
  students: 'student',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
