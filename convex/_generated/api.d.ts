/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as cateringFormSchema from "../cateringFormSchema.js";
import type * as cateringRequests from "../cateringRequests.js";
import type * as formConfig from "../formConfig.js";
import type * as jobApplications from "../jobApplications.js";
import type * as jobFormSchema from "../jobFormSchema.js";
import type * as locations from "../locations.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  cateringFormSchema: typeof cateringFormSchema;
  cateringRequests: typeof cateringRequests;
  formConfig: typeof formConfig;
  jobApplications: typeof jobApplications;
  jobFormSchema: typeof jobFormSchema;
  locations: typeof locations;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
