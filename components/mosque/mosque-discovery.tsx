"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import { DisplayImageType } from "@/types/display-image-type";
import MosqueSearchQueryInput from "@/graphql/models/mosques/MosqueSearchQueryInput";
import { MosqueCardItemQueryResult } from "@/graphql/models/mosques/MosqueCardItemQueryResult";
import MosqueCardItem from "@/models/mosques/MosqueCardItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/icons";
import { MosqueCard } from "@/components/mosque/mosque-card";
import type { MembershipType } from "@/types/mosque";

const GET_MOSQUE_CARDS_QUERY = gql`
  query Mosques(
    $searchQuery: MosqueSearchQueryInput!
    $first: Int
    $after: String
  ) {
    mosques(searchQuery: $searchQuery, first: $first, after: $after) {
      nodes {
        address {
          city
          country {
            isoCode
          }
        }
        name
        description
        id
        memberCount
        displayImages(types: COVER) {
          imageUrl
          displayImageType
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export function MosqueDiscovery({
  onJoinMosque,
}: {
  onJoinMosque?: (mosqueId: string, membershipType: MembershipType) => void;
}) {
  const [activeTab, setActiveTab] = useState("nearby");
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(
    new Set(["nearby"])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchParams, setSearchParams] = useState<MosqueSearchQueryInput>({});
  const [isAccessingLocation, setIsAccessingLocation] = useState(false);
  const pageSize = 1;
  let renderCount = 0;

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleTabChange = (tab: string) => {
    setVisitedTabs((prev) => new Set(prev).add(tab));
    setActiveTab(tab);
  };

  useEffect(() => {
    let isStale = false;
    const params: MosqueSearchQueryInput = {};

    if (debouncedSearch) {
      params.name = debouncedSearch;
    }

    if (activeTab === "nearby") {
      if (navigator.geolocation) {
        setIsAccessingLocation(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (isStale) return;
            setSearchParams({
              ...params,
              geoSearchQuery: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                radiusInMeters: 300,
              },
            });
            setIsAccessingLocation(false);
          },
          () => {
            if (isStale) return;
            setSearchParams(params);
            setIsAccessingLocation(false);
          }
        );
      }
    } else if (activeTab === "joined") {
      setSearchParams({
        ...params,
        userId: "0248b02b-9cde-4aa9-a3fd-8be2bb02567b",
      });
    } else {
      setSearchParams(params); // Popular
    }

    return () => {
      isStale = true;
    };
  }, [debouncedSearch, activeTab]);

  const { loading, error, data, fetchMore } = useQuery(GET_MOSQUE_CARDS_QUERY, {
    variables: { searchQuery: searchParams, first: pageSize },
    notifyOnNetworkStatusChange: true,
    skip: activeTab === "nearby" && !searchParams.geoSearchQuery?.latitude,
    fetchPolicy: "cache-first", // cache-first is the default
  });

  const mosques = (data?.mosques?.nodes as MosqueCardItemQueryResult[]) || [];
  const pageInfo = data?.mosques?.pageInfo;

  const transformMosque = useCallback(
    (mosque: MosqueCardItemQueryResult): MosqueCardItem => ({
      id: mosque.id,
      name: mosque.name,
      city: mosque.address.city,
      countryIsoCode: mosque.address.country.isoCode,
      description: mosque.description,
      memberCount: mosque.memberCount,
      coverImage: mosque.displayImages.find(
        (x) => x.displayImageType == DisplayImageType.Cover
      )?.imageUrl,
    }),
    []
  );

  const transformedMosques = useMemo(
    () => mosques.map(transformMosque),
    [mosques]
  );

  const handleJoinMosque = (
    mosqueId: string,
    membershipType: MembershipType
  ) => {
    onJoinMosque?.(mosqueId, membershipType);
  };

  const handleLoadMore = () => {
    if (pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          after: pageInfo.endCursor,
          searchQuery: searchParams,
          first: pageSize,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            mosques: {
              ...fetchMoreResult.mosques,
              nodes: [...prev.mosques.nodes, ...fetchMoreResult.mosques.nodes],
            },
          };
        },
      });
    }
  };

  const tabItems = [
    { value: "nearby", label: "Nearby" },
    { value: "popular", label: "Popular" },
    { value: "joined", label: "My Mosques" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">Discover Mosques</h2>
        <div className="relative w-full md:w-64">
          <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search mosques..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 rounded-full border-primary/20"
          />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md rounded-xl bg-muted/50 p-1">
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="pt-4">
          {isAccessingLocation ? (
            <LoadingMessage text="Getting your location..." />
          ) : loading && !data ? (
            <LoadingMessage text="Loading mosques..." />
          ) : error ? (
            <ErrorMessage message={error.message} />
          ) : transformedMosques.length === 0 ? (
            <EmptyMessage query={searchQuery} />
          ) : (
            <>
              {console.log(
                new Date().toLocaleTimeString(),
                "Rendering mosques"
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {transformedMosques.map((mosque) => (
                  <MosqueCard
                    key={mosque.id}
                    mosque={mosque}
                    onJoin={handleJoinMosque}
                  />
                ))}
              </div>
              {pageInfo?.hasNextPage && (
                <div className="flex justify-center mt-8">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Icons.chevronsDown className="mr-2 h-4 w-4" />
                    )}
                    {loading ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
}

function LoadingMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-center items-center py-12">
      <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">{text}</span>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icons.alertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-xl font-semibold">Error loading mosques</h3>
      <p className="text-muted-foreground mt-2">{message}</p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => window.location.reload()}
      >
        Try Again
      </Button>
    </div>
  );
}

function EmptyMessage({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icons.mosque className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold">No mosques found</h3>
      <p className="text-muted-foreground mt-2">
        {query
          ? `No mosques matching "${query}" were found.`
          : "Try adjusting your search or location settings."}
      </p>
    </div>
  );
}
