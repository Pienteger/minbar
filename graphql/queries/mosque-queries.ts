import { gql } from "@apollo/client";

export const MOSQUE_FRAGMENT = gql`
  fragment MosqueFields on Mosque {
    id
    name
    description
    memberCount
    capacity
    imageUrls
    address {
      street
      city
      stateOrProvince
      postalCode
      country {
        name
        isoCode
        emoji
      }
    }
    externalLinks {
      key
      value
    }
  }
`;

export const GET_MOSQUES = gql`
  query GetMosques(
    $searchQuery: MosqueSearchInput
    $first: Int
    $after: String
  ) {
    mosques(searchQuery: $searchQuery, first: $first, after: $after) {
      nodes {
        ...MosqueFields
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${MOSQUE_FRAGMENT}
`;

export const GET_MOSQUE_BY_ID = gql`
  query GetMosqueById($id: ID!) {
    mosque(id: $id) {
      ...MosqueFields
      # Add additional fields needed for detailed view
      events {
        id
        title
        description
        startDate
        endDate
        location
      }
      announcements {
        id
        title
        content
        createdAt
      }
    }
  }
  ${MOSQUE_FRAGMENT}
`;

export const GET_USER_MOSQUES = gql`
  query GetUserMosques {
    me {
      id
      mosqueMemberships {
        id
        mosque {
          ...MosqueFields
        }
        role
        type
        status
        joinedAt
      }
    }
  }
  ${MOSQUE_FRAGMENT}
`;
