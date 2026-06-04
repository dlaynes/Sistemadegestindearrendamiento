import type { User } from '../types/user';

/**
 * BE shape coming back from /api/admin/users. The backend serializes the
 * per-user property list as `propertyIds` (camelCase, List<Long>); the FE
 * `User` type expects `properties: (string | number)[]`. This mapper bridges
 * the two without changing the wire format on either side.
 *
 * Unknown / missing fields are tolerated: the FE has multiple sources of
 * truth (login payload, stored session, list endpoint) and not all of them
 * include propertyIds.
 */
type BeUser = User & { propertyIds?: number[] | null };

export function toFrontendUser(raw: BeUser): User {
  const { propertyIds, ...rest } = raw;
  return {
    ...rest,
    properties: propertyIds && propertyIds.length > 0 ? propertyIds : undefined,
  };
}
