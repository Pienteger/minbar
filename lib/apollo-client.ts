import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from,
} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {onError} from "@apollo/client/link/error";
import {Observable} from "@apollo/client/utilities";
import {
    getStoredToken,
    setStoredTokens,
    clearStoredTokens,
} from "./token-storage";
import {authApi} from "@/lib/apis/auth-api";

// GraphQL API endpoint
const httpLink = createHttpLink({
    uri:
        process.env.NEXT_PUBLIC_GRAPHQL_API_URL ||
        "https://localhost:7215/graphql/",
});

// Refresh queue management
let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

const resolvePendingRequests = () => {
    pendingRequests.forEach((cb) => cb());
    pendingRequests = [];
};

const errorLink = onError(({graphQLErrors, networkError, operation, forward}) => {
    if (graphQLErrors) {
        for (const err of graphQLErrors) {
            if (err.message === "Unauthorized") {
                return new Observable((observer) => {
                    const token = getStoredToken();

                    if (!token?.refreshToken) {
                        clearStoredTokens();
                        observer.error(err);
                        return;
                    }

                    const retryRequest = () => {
                        const newToken = getStoredToken();
                        if (newToken?.accessToken) {
                            operation.setContext(({headers = {}}) => ({
                                headers: {
                                    ...headers,
                                    authorization: `Bearer ${newToken.accessToken}`,
                                },
                            }));
                            forward(operation).subscribe({
                                next: observer.next.bind(observer),
                                error: observer.error.bind(observer),
                                complete: observer.complete.bind(observer),
                            });
                        } else {
                            observer.error(err);
                        }
                    };

                    pendingRequests.push(retryRequest);

                    if (!isRefreshing) {
                        isRefreshing = true;
                        authApi
                            .refreshToken({refreshToken: token.refreshToken})
                            .then((res) => {
                                setStoredTokens(res.data);
                                resolvePendingRequests();
                            })
                            .catch(() => {
                                clearStoredTokens();
                                pendingRequests = [];
                            })
                            .finally(() => {
                                isRefreshing = false;
                            });
                    }
                });
            }
        }
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

const authLink = setContext((_, {headers}) => {
    const token = getStoredToken();
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token.accessToken}` : "",
        },
    };
});

export const apolloClient = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "cache-and-network",
        },
    },
});
