import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import type {
  Category,
  CreateTravelPackageBody,
  HealthStatus,
  ListPackagesParams,
  PackageSummary,
  TravelPackage,
} from "./api.schemas";

import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";

type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const getHealthCheckUrl = () => `/api/healthz`;

export const healthCheck = async (options?: RequestInit): Promise<HealthStatus> =>
  customFetch<HealthStatus>(getHealthCheckUrl(), { ...options, method: "GET" });

export const getHealthCheckQueryKey = () => [`/api/healthz`] as const;

export const getHealthCheckQueryOptions = <
  TData = Awaited<ReturnType<typeof healthCheck>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getHealthCheckQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof healthCheck>>> = ({ signal }) =>
    healthCheck({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof healthCheck>>, TError, TData
  > & { queryKey: QueryKey };
};

export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;

export function useHealthCheck<
  TData = Awaited<ReturnType<typeof healthCheck>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getHealthCheckQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getListPackagesUrl = (params?: ListPackagesParams) => {
  const normalizedParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? "null" : value.toString());
    }
  });
  const stringifiedParams = normalizedParams.toString();
  return stringifiedParams.length > 0 ? `/api/packages?${stringifiedParams}` : `/api/packages`;
};

export const listPackages = async (params?: ListPackagesParams, options?: RequestInit): Promise<TravelPackage[]> =>
  customFetch<TravelPackage[]>(getListPackagesUrl(params), { ...options, method: "GET" });

export const getListPackagesQueryKey = (params?: ListPackagesParams) =>
  [`/api/packages`, ...(params ? [params] : [])] as const;

export const getListPackagesQueryOptions = <
  TData = Awaited<ReturnType<typeof listPackages>>,
  TError = ErrorType<unknown>,
>(params?: ListPackagesParams, options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof listPackages>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getListPackagesQueryKey(params);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof listPackages>>> = ({ signal }) =>
    listPackages(params, { signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listPackages>>, TError, TData
  > & { queryKey: QueryKey };
};

export type ListPackagesQueryResult = NonNullable<Awaited<ReturnType<typeof listPackages>>>;
export type ListPackagesQueryError = ErrorType<unknown>;

export function useListPackages<
  TData = Awaited<ReturnType<typeof listPackages>>,
  TError = ErrorType<unknown>,
>(params?: ListPackagesParams, options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof listPackages>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListPackagesQueryOptions(params, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getCreatePackageUrl = () => `/api/packages`;

export const createPackage = async (
  createTravelPackageBody: CreateTravelPackageBody,
  options?: RequestInit,
): Promise<TravelPackage> =>
  customFetch<TravelPackage>(getCreatePackageUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(createTravelPackageBody),
  });

export const getCreatePackageMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPackage>>, TError, { data: BodyType<CreateTravelPackageBody> }, TContext>;
    request?: SecondParameter<typeof customFetch>;
  }
): UseMutationOptions<Awaited<ReturnType<typeof createPackage>>, TError, { data: BodyType<CreateTravelPackageBody> }, TContext> => {
  const mutationKey = ["createPackage"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof createPackage>>, { data: BodyType<CreateTravelPackageBody> }> = (props) => {
    const { data } = props ?? {};
    return createPackage(data, requestOptions);
  };
  return { mutationFn, ...mutationOptions };
};

export type CreatePackageMutationResult = NonNullable<Awaited<ReturnType<typeof createPackage>>>;
export type CreatePackageMutationBody = BodyType<CreateTravelPackageBody>;
export type CreatePackageMutationError = ErrorType<unknown>;

export const useCreatePackage = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPackage>>, TError, { data: BodyType<CreateTravelPackageBody> }, TContext>;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<Awaited<ReturnType<typeof createPackage>>, TError, { data: BodyType<CreateTravelPackageBody> }, TContext> =>
  useMutation(getCreatePackageMutationOptions(options));

export const getGetFeaturedPackagesUrl = () => `/api/packages/featured`;

export const getFeaturedPackages = async (options?: RequestInit): Promise<TravelPackage[]> =>
  customFetch<TravelPackage[]>(getGetFeaturedPackagesUrl(), { ...options, method: "GET" });

export const getGetFeaturedPackagesQueryKey = () => [`/api/packages/featured`] as const;

export const getGetFeaturedPackagesQueryOptions = <
  TData = Awaited<ReturnType<typeof getFeaturedPackages>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getFeaturedPackages>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetFeaturedPackagesQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getFeaturedPackages>>> = ({ signal }) =>
    getFeaturedPackages({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getFeaturedPackages>>, TError, TData
  > & { queryKey: QueryKey };
};

export type GetFeaturedPackagesQueryResult = NonNullable<Awaited<ReturnType<typeof getFeaturedPackages>>>;
export type GetFeaturedPackagesQueryError = ErrorType<unknown>;

export function useGetFeaturedPackages<
  TData = Awaited<ReturnType<typeof getFeaturedPackages>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getFeaturedPackages>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetFeaturedPackagesQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getGetPackagesSummaryUrl = () => `/api/packages/summary`;

export const getPackagesSummary = async (options?: RequestInit): Promise<PackageSummary> =>
  customFetch<PackageSummary>(getGetPackagesSummaryUrl(), { ...options, method: "GET" });

export const getGetPackagesSummaryQueryKey = () => [`/api/packages/summary`] as const;

export const getGetPackagesSummaryQueryOptions = <
  TData = Awaited<ReturnType<typeof getPackagesSummary>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getPackagesSummary>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetPackagesSummaryQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getPackagesSummary>>> = ({ signal }) =>
    getPackagesSummary({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getPackagesSummary>>, TError, TData
  > & { queryKey: QueryKey };
};

export type GetPackagesSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getPackagesSummary>>>;
export type GetPackagesSummaryQueryError = ErrorType<unknown>;

export function useGetPackagesSummary<
  TData = Awaited<ReturnType<typeof getPackagesSummary>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getPackagesSummary>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetPackagesSummaryQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getGetPackageUrl = (id: number) => `/api/packages/${id}`;

export const getPackage = async (id: number, options?: RequestInit): Promise<TravelPackage> =>
  customFetch<TravelPackage>(getGetPackageUrl(id), { ...options, method: "GET" });

export const getGetPackageQueryKey = (id: number) => [`/api/packages/${id}`] as const;

export const getGetPackageQueryOptions = <
  TData = Awaited<ReturnType<typeof getPackage>>,
  TError = ErrorType<void>,
>(id: number, options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getPackage>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetPackageQueryKey(id);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getPackage>>> = ({ signal }) =>
    getPackage(id, { signal, ...requestOptions });
  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getPackage>>, TError, TData
  > & { queryKey: QueryKey };
};

export type GetPackageQueryResult = NonNullable<Awaited<ReturnType<typeof getPackage>>>;
export type GetPackageQueryError = ErrorType<void>;

export function useGetPackage<
  TData = Awaited<ReturnType<typeof getPackage>>,
  TError = ErrorType<void>,
>(id: number, options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getPackage>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetPackageQueryOptions(id, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getUpdatePackageUrl = (id: number) => `/api/packages/${id}`;

export const updatePackage = async (
  id: number,
  createTravelPackageBody: CreateTravelPackageBody,
  options?: RequestInit,
): Promise<TravelPackage> =>
  customFetch<TravelPackage>(getUpdatePackageUrl(id), {
    ...options,
    method: "PUT",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(createTravelPackageBody),
  });

export const getUpdatePackageMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePackage>>, TError, { id: number; data: BodyType<CreateTravelPackageBody> }, TContext>;
    request?: SecondParameter<typeof customFetch>;
  }
): UseMutationOptions<Awaited<ReturnType<typeof updatePackage>>, TError, { id: number; data: BodyType<CreateTravelPackageBody> }, TContext> => {
  const mutationKey = ["updatePackage"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof updatePackage>>, { id: number; data: BodyType<CreateTravelPackageBody> }> = (props) => {
    const { id, data } = props ?? {};
    return updatePackage(id, data, requestOptions);
  };
  return { mutationFn, ...mutationOptions };
};

export type UpdatePackageMutationResult = NonNullable<Awaited<ReturnType<typeof updatePackage>>>;
export type UpdatePackageMutationBody = BodyType<CreateTravelPackageBody>;
export type UpdatePackageMutationError = ErrorType<unknown>;

export const useUpdatePackage = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePackage>>, TError, { id: number; data: BodyType<CreateTravelPackageBody> }, TContext>;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<Awaited<ReturnType<typeof updatePackage>>, TError, { id: number; data: BodyType<CreateTravelPackageBody> }, TContext> =>
  useMutation(getUpdatePackageMutationOptions(options));

export const getDeletePackageUrl = (id: number) => `/api/packages/${id}`;

export const deletePackage = async (id: number, options?: RequestInit): Promise<void> =>
  customFetch<void>(getDeletePackageUrl(id), { ...options, method: "DELETE" });

export const getDeletePackageMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePackage>>, TError, { id: number }, TContext>;
    request?: SecondParameter<typeof customFetch>;
  }
): UseMutationOptions<Awaited<ReturnType<typeof deletePackage>>, TError, { id: number }, TContext> => {
  const mutationKey = ["deletePackage"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };
  const mutationFn: MutationFunction<Awaited<ReturnType<typeof deletePackage>>, { id: number }> = (props) => {
    const { id } = props ?? {};
    return deletePackage(id, requestOptions);
  };
  return { mutationFn, ...mutationOptions };
};

export type DeletePackageMutationResult = NonNullable<Awaited<ReturnType<typeof deletePackage>>>;
export type DeletePackageMutationError = ErrorType<unknown>;

export const useDeletePackage = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePackage>>, TError, { id: number }, TContext>;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<Awaited<ReturnType<typeof deletePackage>>, TError, { id: number }, TContext> =>
  useMutation(getDeletePackageMutationOptions(options));

export const getListCategoriesUrl = () => `/api/categories`;

export const listCategories = async (options?: RequestInit): Promise<Category[]> =>
  customFetch<Category[]>(getListCategoriesUrl(), { ...options, method: "GET" });

export const getListCategoriesQueryKey = () => [`/api/categories`] as const;

export const getListCategoriesQueryOptions = <
  TData = Awaited<ReturnType<typeof listCategories>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getListCategoriesQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof listCategories>>> = ({ signal }) =>
    listCategories({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listCategories>>, TError, TData
  > & { queryKey: QueryKey };
};

export type ListCategoriesQueryResult = NonNullable<Awaited<ReturnType<typeof listCategories>>>;
export type ListCategoriesQueryError = ErrorType<unknown>;

export function useListCategories<
  TData = Awaited<ReturnType<typeof listCategories>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListCategoriesQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}
